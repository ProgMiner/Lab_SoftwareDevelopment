package ru.byprogminer.shellin.command

import io.mockk.mockk
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import ru.byprogminer.shellin.State


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
    fun `test run`() {
        assertThrows<NotImplementedError> {
            testCommand {
                PipelineCommand(listOf(mockk(), mockk())).exec()
            }
        }
    }

    private inline fun testCommand(input: String = "", block: CommandTest.() -> Unit) {
        CommandTest(state, input).block()
    }
}
