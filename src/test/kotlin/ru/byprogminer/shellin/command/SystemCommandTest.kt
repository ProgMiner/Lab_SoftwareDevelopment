package ru.byprogminer.shellin.command

import org.junit.jupiter.api.Assumptions.assumeFalse
import org.junit.jupiter.api.Assumptions.assumeTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import ru.byprogminer.shellin.State
import java.nio.file.Paths
import kotlin.test.assertEquals
import kotlin.test.assertTrue


class SystemCommandTest {

    lateinit var state: State

    @BeforeEach
    fun init() {
        state = State(System.getenv().toMutableMap())
    }

    @Test
    fun `test empty commands`() {
        assertThrows<IllegalArgumentException> {
            SystemCommand(emptyList())
        }
    }

    @Test
    fun `test bad command`() {
        state.environment[State.PATH_VARIABLE] = ""

        val cmd = SystemCommand(listOf("non existing command", "test hello world"))

        val exception = assertThrows<IllegalArgumentException> {
            testCommand {
                cmd.exec()
            }
        }

        assertEquals("No such executable in PATH: \"non existing command\"", exception.message)
    }

    @Test
    fun `test bad local command`() {
        state.pwd = Paths.get("")

        val cmd = SystemCommand(listOf("./local", "test hello world"))

        assertThrows<Exception> {
            testCommand {
                cmd.exec()
            }
        }
    }

    @Test
    fun `test normal system without input success`() {
        assumeFalse(System.getProperty("os.name").contains("win", true))

        val cmd = SystemCommand(listOf("echo", "test hello world"))

        testCommand {
            cmd.exec()

            assertEquals("test hello world", output)
            assertTrue(error.isEmpty())
        }
    }

    @Test
    fun `test normal system without input failure`() {
        assumeFalse(System.getProperty("os.name").contains("win", true))

        val cmd = SystemCommand(listOf("rm", "/etc/passwd"))

        testCommand {
            cmd.exec()

            assertTrue(error.trimEnd { it == '-' || it.isDigit() }.endsWith("Process exited with code "))
        }
    }

    @Test
    fun `test normal system with input success`() {
        assumeFalse(System.getProperty("os.name").contains("win", true))

        val cmd = SystemCommand(listOf("cat"))

        val text = """
test

hello world

русский текст
""".trim()

        testCommand(text) {
            cmd.exec()

            assertEquals(text, output)
            assertTrue(error.isEmpty())
        }
    }

    @Test
    fun `test normal system with input failure`() {
        assumeFalse(System.getProperty("os.name").contains("win", true))

        val cmd = SystemCommand(listOf("grep", "-F", "non existing line"))

        val text = """
test

hello world

русский текст
""".trim()

        testCommand(text) {
            cmd.exec()

            assertTrue(output.isEmpty())
            assertTrue(error.trimEnd { it == '-' || it.isDigit() }.endsWith("Process exited with code "))
        }
    }

    @Test
    fun `test on Windows 🤡`() {
        assumeTrue(System.getProperty("os.name").contains("win", true))

        val cmd = SystemCommand(listOf("dir.exe"))

        testCommand {
            cmd.exec()

            assertEquals("test hello world", output)
            assertTrue(error.isEmpty())
        }
    }

    private inline fun testCommand(input: String = "", block: CommandTest.() -> Unit) {
        CommandTest(state, input).block()
    }
}
