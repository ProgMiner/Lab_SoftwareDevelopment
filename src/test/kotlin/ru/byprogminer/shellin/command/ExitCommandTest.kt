package ru.byprogminer.shellin.command

import io.mockk.confirmVerified
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import ru.byprogminer.shellin.State
import kotlin.test.assertEquals
import kotlin.test.assertTrue


class ExitCommandTest {

    lateinit var state: State

    @BeforeEach
    fun init() {
        state = mockk()
    }

    @Test
    fun `test empty args`() {
        assertThrows<IllegalArgumentException> {
            ExitCommand(emptyList())
        }
    }

    @Test
    fun `test run`() {
        every { state.stop() } returns Unit

        testCommand {
            ExitCommand(listOf("exit")).exec()

            assertTrue(output.isEmpty())
            assertTrue(error.isEmpty())
        }

        verify(exactly = 1) { state.stop() }

        confirmVerified(state)
    }

    @Test
    fun `test some args`() {
        testCommand {
            ExitCommand(listOf("exit", "test")).exec()

            assertTrue(output.isEmpty())
            assertEquals("Too many arguments.", error)
        }

        testCommand {
            ExitCommand(listOf("exit", "test", "foo", "bar")).exec()

            assertTrue(output.isEmpty())
            assertEquals("Too many arguments.", error)
        }
    }

    private inline fun testCommand(input: String = "", block: CommandTest.() -> Unit) {
        CommandTest(state, input).block()
    }
}
