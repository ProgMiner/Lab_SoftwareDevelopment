package ru.byprogminer.shellin.command

import io.mockk.mockk
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import ru.byprogminer.shellin.State
import kotlin.test.assertEquals
import kotlin.test.assertTrue


class EchoCommandTest {

    lateinit var state: State

    @BeforeEach
    fun init() {
        state = mockk()
    }

    @Test
    fun `test empty args`() {
        assertThrows<IllegalArgumentException> {
            EchoCommand(emptyList())
        }
    }

    @Test
    fun `test no args`() {
        testCommand {
            EchoCommand(listOf("echo")).exec()

            assertTrue(output.isEmpty())
            assertTrue(error.isEmpty())
        }
    }

    @Test
    fun `test one arg`() {
        testCommand {
            EchoCommand(listOf("echo", "kek")).exec()

            assertEquals("kek", output)
            assertTrue(error.isEmpty())
        }
    }

    @Test
    fun `test some args`() {
        testCommand {
            EchoCommand(listOf("echo", "kek", "lol", "foo", "bar")).exec()

            assertEquals("kek lol foo bar", output)
            assertTrue(error.isEmpty())
        }
    }

    @Test
    fun `test some args with spaces`() {
        testCommand {
            EchoCommand(listOf("echo", "kek    lol", "foo     bar")).exec()

            assertEquals("kek    lol foo     bar", output)
            assertTrue(error.isEmpty())
        }
    }

    private inline fun testCommand(input: String = "", block: CommandTest.() -> Unit) {
        CommandTest(state, input).block()
    }
}
