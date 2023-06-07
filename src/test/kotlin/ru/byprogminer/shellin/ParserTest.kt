package ru.byprogminer.shellin

import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.ValueSource
import ru.byprogminer.shellin.command.*
import java.io.*
import kotlin.test.assertEquals
import kotlin.test.assertIs
import kotlin.test.assertNotNull
import kotlin.test.assertTrue


class ParserTest {

    private companion object {

        val charset = Charsets.UTF_8
    }

    private lateinit var state: State
    private lateinit var parser: Parser

    @BeforeEach
    fun init() {
        state = mockk()
        parser = Parser(state)
    }

    @Test
    fun `test EOF`() {
        assertThrows<EOFException> {
            parser.parse(createStream(""))
        }

        assertThrows<EOFException> {
            parser.parse(createStream("some string может быть с юникодом without end of line"))
        }
    }

    @Test
    fun `test empty line`() {
        assertEquals(null, parser.parse(createStream("\n")))
        assertEquals(null, parser.parse(createStream("\r\n")))
    }

    @Test
    fun `test rest preserved`() {
        run {
            val stream = createStream("\nsome command input может быть с юникодом")

            assertEquals(null, parser.parse(stream))
            assertEquals("some command input может быть с юникодом", stream.bufferedReader(charset).readText())
        }

        run {
            val stream = createStream(
                "some command может быть с юникодом\nsome command input может быть с юникодом"
            )

            try {
                parser.parse(stream)
            } catch (e: IllegalArgumentException) {
                // ignored
            }

            assertEquals("some command input может быть с юникодом", stream.bufferedReader(charset).readText())
        }
    }

    @Test
    fun `test long command`() {
        val arg = "a".repeat(4097)

        assertEquals(arg, execEcho(parser.parse(createStream("echo $arg\n"))))
    }

    @Test
    fun `test double quotes`() {
        assertEquals(
            "    ",
            execEcho(parser.parse(createStream("echo \"    \"\n"))),
        )

        assertEquals(
            "    a  b   c",
            execEcho(parser.parse(createStream("echo \"   \"  a  \" b  \" c\n"))),
        )

        assertEquals(
            "   \"    \"   ",
            execEcho(parser.parse(createStream("echo '   \"    \"   '\n"))),
        )

        assertEquals(
            "   '    '   ",
            execEcho(parser.parse(createStream("echo \"   '    '   \"\n"))),
        )

        assertEquals(
            "sdfsd    fsdf",
            execEcho(parser.parse(createStream("echo sdfsd\"    \"fsdf\n"))),
        )

        assertThrows<IllegalArgumentException> {
            parser.parse(createStream(" sdfsd  \"   sdfsdf  \n"))
        }

        assertThrows<IllegalArgumentException> {
            parser.parse(createStream(" sdfsd  \"   sdf\"sd\"f  \n"))
        }
    }

    @Test
    fun `test single quotes`() {
        assertEquals(
            "    ",
            execEcho(parser.parse(createStream("echo '    '\n"))),
        )

        assertEquals(
            "    a  b   c",
            execEcho(parser.parse(createStream("echo '   '  a  ' b  ' c\n"))),
        )

        assertEquals(
            "   \"    \"   ",
            execEcho(parser.parse(createStream("echo '   \"    \"   '\n"))),
        )

        assertEquals(
            "   '    '   ",
            execEcho(parser.parse(createStream("echo \"   '    '   \"\n"))),
        )

        assertEquals(
            "sdfsd    fsdf",
            execEcho(parser.parse(createStream("echo sdfsd'    'fsdf\n"))),
        )

        assertThrows<IllegalArgumentException> {
            parser.parse(createStream(" sdfsd  '   sdfsdf  \n"))
        }

        assertThrows<IllegalArgumentException> {
            parser.parse(createStream(" sdfsd  '   sdf'sd'f  \n"))
        }
    }

    @Test
    fun `test variables`() {
        every { state.environment } answers {
            mutableMapOf("test" to "kek")
        }

        assertEquals(
            "kek",
            execEcho(parser.parse(createStream("echo \$test\n"))),
        )

        assertEquals(
            "testkek",
            execEcho(parser.parse(createStream("echo test\$test\n"))),
        )

        assertEquals(
            "",
            execEcho(parser.parse(createStream("echo \$testtest\n"))),
        )

        assertEquals(
            "\$test",
            execEcho(parser.parse(createStream("echo '\$test'\n"))),
        )

        assertEquals(
            "test kek test",
            execEcho(parser.parse(createStream("echo \"test \$test test\"\n"))),
        )
    }

    @Test
    fun `test pipeline`() {
        assertEquals("test | lol", execEcho(parser.parse(createStream("echo 'test | lol'\n"))))
        assertEquals("test | lol", execEcho(parser.parse(createStream("echo \"test | lol\"\n"))))

        assertIs<PipelineCommand>(parser.parse(createStream("echo \"test\" | echo \"lol\"\n")))
        assertIs<PipelineCommand>(parser.parse(createStream("echo 'test' | echo 'lol'\n")))

        assertIs<PipelineCommand>(parser.parse(createStream("echo \"test\"|echo \"lol\"\n")))
        assertIs<PipelineCommand>(parser.parse(createStream("echo 'test'|echo 'lol'\n")))

        assertIs<PipelineCommand>(parser.parse(createStream("echo | echo\n")))

        assertThrows<IllegalArgumentException> {
            parser.parse(createStream("echo | \n"))
        }

        assertThrows<IllegalArgumentException> {
            parser.parse(createStream(" | echo\n"))
        }

        assertThrows<IllegalArgumentException> {
            parser.parse(createStream(" | \n"))
        }
    }

    @ParameterizedTest
    @ValueSource(strings = [
        "a=b",
        "a='b'", "a'=b'", "a'='b", "'a='b", "'a'=b", "'a'='b'",
        "a=\"b\"", "a\"=b\"", "a\"=\"b", "\"a=\"b", "\"a\"=b", "\"a\"=\"b\"",
    ])
    fun `test simple assignment`(cmd: String) {
        val result = parser.parse(createStream(cmd + '\n'))
        assertIs<AssignCommand>(result)

        val env = mutableMapOf<String, String>()
        every { state.environment } returns env

        result.exec(mockk(), mockk(), mockk(), state)

        assertEquals(mapOf("a" to "b"), env)
    }

    @ParameterizedTest
    @ValueSource(strings = [
        "a=b",
        "a='b'", "a'=b'", "a'='b", "'a='b", "'a'=b", "'a'='b'",
        "a=\"b\"", "a\"=b\"", "a\"=\"b", "\"a=\"b", "\"a\"=b", "\"a\"=\"b\"",
    ])
    fun `test assignment with command`(cmd: String) {
        val env = mutableMapOf<String, String>()
        every { state.environment } returns env

        val result = parser.parse(createStream("$cmd echo test\$a\n"))
        assertIs<AssignCommand>(result)

        val env2 = mutableMapOf<String, String>()
        every { state.copy() } answers {
            State(env2)
        }

        assertEquals("test", execEcho(result))

        assertEquals(emptyMap(), env)
        assertEquals(mapOf("a" to "b"), env2)
    }

    @Test
    fun `test internal commands`() {
        assertIs<CatCommand>(parser.parse(createStream("cat\n")))
        assertIs<EchoCommand>(parser.parse(createStream("echo\n")))
        assertIs<WcCommand>(parser.parse(createStream("wc\n")))
        assertIs<PwdCommand>(parser.parse(createStream("pwd\n")))
        assertIs<ExitCommand>(parser.parse(createStream("exit\n")))
    }

    private fun createStream(content: String) =
        BufferedInputStream(ByteArrayInputStream(content.toByteArray(charset)))

    private fun execEcho(command: Command?): String {
        assertNotNull(command)

        val output = ByteArrayOutputStream()
        val error = ByteArrayOutputStream()

        command.exec(createStream(""), PrintStream(output), PrintStream(error), state)

        assertTrue(error.toByteArray().isEmpty())

        return output.toByteArray().toString(charset).trimEnd('\n')
    }
}
