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


class GrepCommandTest {

    lateinit var state: State

    @BeforeEach
    fun init() {
        state = mockk()
    }

    @Test
    fun `test empty args`() {
        assertThrows<IllegalArgumentException> {
            GrepCommand(emptyList())
        }
    }

    @Test
    fun `test no args`() {
        val cmd = GrepCommand(listOf("grep"))

        testCommand {
            cmd.exec()

            assertTrue(output.isEmpty())
            assertEquals("grep: missing PATTERN operand", error)
        }
    }

    @Test
    fun `test only pattern`() {
        val cmd = GrepCommand(listOf("grep", "^.est.*$"))

        testCommand("best line\nfoo bar\ntest\nlol") {
            cmd.exec()

            assertEquals("best line\ntest", output)
            assertTrue(error.isEmpty())
        }
    }

    @Test
    fun `test -w option`() {
        val cmd = GrepCommand(listOf("grep", "-w", "bar"))

        testCommand("foobar\nfoo bar\n") {
            cmd.exec()

            assertEquals("foo bar", output)
            assertTrue(error.isEmpty())
        }
    }

    @Test
    fun `test -i option`() {
        val cmd = GrepCommand(listOf("grep", "-i", "bar"))

        testCommand("fooBaR\nfoo bAR\n") {
            cmd.exec()

            assertEquals("fooBaR\nfoo bAR", output)
            assertTrue(error.isEmpty())
        }
    }

    @Test
    fun `test -A option text`() {
        val cmd = GrepCommand(listOf("grep", "-Akek", "bar"))

        testCommand {
            cmd.exec()

            assertTrue(output.isEmpty())
            assertEquals("grep: -A value must be an integer", error)
        }
    }

    @Test
    fun `test -A option neg`() {
        val cmd = GrepCommand(listOf("grep", "-A", "-1", "bar"))

        testCommand {
            cmd.exec()

            assertTrue(output.isEmpty())
            assertEquals("grep: -A value must be non-negative", error)
        }
    }

    @Test
    fun `test -A option`() {
        val cmd = GrepCommand(listOf("grep", "-A3", "interest"))

        testCommand("""
test

abcd
kek

this line is interesting
and this too
hmm I think this too
this line is so interesting
abcd
test interesting
idk
""") {
            cmd.exec()

            assertEquals(
                """this line is interesting
and this too
hmm I think this too
this line is so interesting
abcd
test interesting
idk""", output)
            assertTrue(error.isEmpty())
        }
    }

    @Test
    fun `test existing file with absolute path`() {
        val file = Files.createTempFile("testCat", ".txt")

        file.bufferedWriter().use {
            it.write("best line\n")
            it.write("foo bar\n")
            it.write("test\n")
            it.write("lol")
        }

        val cmd = GrepCommand(listOf("grep", "^.est.*$", file.toAbsolutePath().toString()))

        every { state.pwd } returns Paths.get("bad path")

        testCommand {
            cmd.exec()

            assertEquals("best line\ntest", output)
            assertTrue(error.isEmpty())
        }
    }

    @Test
    fun `test existing file with relative path`() {
        val file = Files.createTempFile("testCat", ".txt")

        file.bufferedWriter().use {
            it.write("best line\n")
            it.write("foo bar\n")
            it.write("test\n")
            it.write("lol")
        }

        val cmd = GrepCommand(listOf("grep", "^.est.*$", file.fileName.toString()))

        every { state.pwd } returns file.parent

        testCommand {
            cmd.exec()

            assertEquals("best line\ntest", output)
            assertTrue(error.isEmpty())
        }
    }

    @Test
    fun `test non existing file`() {
        val cmd = GrepCommand(listOf("grep", "test", "bad path"))

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

        val cmd = GrepCommand(listOf("grep", "test", file.fileName.toString()))

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
