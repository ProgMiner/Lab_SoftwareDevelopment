package ru.byprogminer.shellin.command

import io.mockk.mockk
import org.junit.jupiter.api.Assumptions.assumeFalse
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import ru.byprogminer.shellin.State
import kotlin.test.assertEquals
import kotlin.test.assertTrue


class PipelineCommandTest {

    lateinit var state: State

    @BeforeEach
    fun init() {
        state = mockk()
    }

    @Test
    fun `test empty commands`() {
        assertThrows<IllegalArgumentException> {
            PipelineCommand(emptyList())
        }
    }

    @Test
    fun `test one command`() {
        assertThrows<IllegalArgumentException> {
            PipelineCommand(listOf(mockk()))
        }
    }

    @Test
    fun `test two commands`() {
        state = State(mutableMapOf())

        val cmd = PipelineCommand(listOf(
            EchoCommand(listOf("echo", "test")),
            EchoCommand(listOf("echo", "foo", "bar")),
        ))

        testCommand {
            cmd.exec()

            assertEquals("foo bar", output)
            assertTrue(error.isEmpty())
        }
    }

    @Test
    fun `test more commands`() {
        state = State(mutableMapOf())

        val cmd = PipelineCommand(listOf(
            EchoCommand(listOf("echo", "test")),
            EchoCommand(listOf("echo", "foo", "bar")),
            EchoCommand(listOf("echo", "kek", "lol")),
        ))

        testCommand {
            cmd.exec()

            assertEquals("kek lol", output)
            assertTrue(error.isEmpty())
        }
    }

    @Test
    fun `test complex`() {
        assumeFalse(listOf("mac", "darwin", "win").any { System.getProperty("os.name").contains(it, true) })

        state = State(System.getenv().toMutableMap())

        val cmd = PipelineCommand(listOf(
            EchoCommand(listOf("echo", "test")),
            SystemCommand(listOf("grep", "-F", "es")),
            SystemCommand(listOf("cat")),
        ))

        testCommand {
            cmd.exec()

            assertEquals("test", output)
            assertTrue(error.isEmpty())
        }
    }

    private inline fun testCommand(input: String = "", block: CommandTest.() -> Unit) {
        CommandTest(state, input).block()
    }
}
