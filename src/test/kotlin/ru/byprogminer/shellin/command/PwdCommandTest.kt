package ru.byprogminer.shellin.command

import io.mockk.confirmVerified
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import ru.byprogminer.shellin.State
import java.nio.file.Paths
import kotlin.test.assertEquals
import kotlin.test.assertTrue


class PwdCommandTest {

    lateinit var state: State

    @BeforeEach
    fun init() {
        state = mockk()
    }

    @Test
    fun `test empty args`() {
        assertThrows<IllegalArgumentException> {
            PwdCommand(emptyList())
        }
    }

    @Test
    fun `test no args`() {
        every { state.pwd } returns Paths.get("test path")

        testCommand {
            PwdCommand(listOf("pwd")).exec()

            assertEquals("test path", output)
            assertTrue(error.isEmpty())
        }

        verify(exactly = 1) { state.pwd }

        confirmVerified(state)
    }

    @Test
    fun `test some args`() {
        testCommand {
            PwdCommand(listOf("pwd", "kek")).exec()

            assertTrue(output.isEmpty())
            assertEquals("Too many arguments.", error)
        }

        testCommand {
            PwdCommand(listOf("pwd", "kek", "lol", "foo", "bar")).exec()

            assertTrue(output.isEmpty())
            assertEquals("Too many arguments.", error)
        }
    }

    private inline fun testCommand(input: String = "", block: CommandTest.() -> Unit) {
        CommandTest(state, input).block()
    }
}
