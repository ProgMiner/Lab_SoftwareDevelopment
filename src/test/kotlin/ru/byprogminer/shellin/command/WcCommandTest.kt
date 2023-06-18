package ru.byprogminer.shellin.command

import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Assumptions.assumeFalse
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import ru.byprogminer.shellin.State
import java.nio.file.Files
import java.nio.file.Paths
import kotlin.io.path.bufferedWriter
import kotlin.test.assertEquals
import kotlin.test.assertTrue


class WcCommandTest {

    lateinit var state: State

    @BeforeEach
    fun init() {
        state = mockk()
    }

    @Test
    fun `test empty args`() {
        assertThrows<IllegalArgumentException> {
            WcCommand(emptyList())
        }
    }

    @Test
    fun `test no args`() {
        val cmd = WcCommand(listOf("wc"))

        testCommand {
            cmd.exec()

            assertEquals("Usage: wc <FILE>", output)
            assertTrue(error.isEmpty())
        }
    }

    @Test
    fun `test existing file with absolute path`() {
        val file = Files.createTempFile("testCat", ".txt")

        file.bufferedWriter().use {
            it.write("""
test
русский текст

lol 12312
""".trim())
        }

        val cmd = WcCommand(listOf("wc", file.toAbsolutePath().toString()))

        every { state.pwd } returns Paths.get("bad path")

        testCommand {
            cmd.exec()

            assertEquals("3\t4\t41\t${file.toAbsolutePath()}", output)
            assertTrue(error.isEmpty())
        }
    }

    @Test
    fun `test existing file with relative path`() {
        val file = Files.createTempFile("testCat", ".txt")

        file.bufferedWriter().use {
            it.write("""
test
русский текст

lol 12312
""".trim())
        }

        val cmd = WcCommand(listOf("wc", file.fileName.toString()))

        every { state.pwd } returns file.parent

        testCommand {
            cmd.exec()

            assertEquals("3\t4\t41\t${file.fileName}", output)
            assertTrue(error.isEmpty())
        }
    }

    @Test
    fun `test non existing file`() {
        val cmd = WcCommand(listOf("wc", "bad path"))

        every { state.pwd } returns Paths.get("")

        testCommand {
            cmd.exec()

            assertTrue(output.isEmpty())
            assertEquals("File not found: \"bad path\".", error)
        }
    }

    @Test
    fun `test non accessible file`() {
        assumeFalse(System.getProperty("os.name").contains("win", true))

        val file = Files.createTempFile("testCat", ".txt")
        Files.setPosixFilePermissions(file, setOf())

        val cmd = WcCommand(listOf("wc", file.fileName.toString()))

        every { state.pwd } returns file.parent

        testCommand {
            cmd.exec()

            assertTrue(output.isEmpty())
            assertEquals("Access denied: \"$file\".", error)
        }
    }

    private inline fun testCommand(input: String = "", block: CommandTest.() -> Unit) {
        CommandTest(state, input).block()
    }
}
