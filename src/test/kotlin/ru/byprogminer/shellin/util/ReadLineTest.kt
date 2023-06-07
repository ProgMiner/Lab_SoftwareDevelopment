package ru.byprogminer.shellin.util

import org.junit.jupiter.api.Test
import java.io.BufferedInputStream
import java.io.ByteArrayInputStream
import kotlin.test.assertEquals
import kotlin.test.assertNull


class ReadLineTest {

    private companion object {

        val charset = Charsets.UTF_8
    }

    @Test
    fun `test EOF`() {
        assertNull(createStream("").readLine())
        assertNull(createStream("some string может быть с юникодом without end of line").readLine())
    }

    @Test
    fun `test empty line`() {
        assertEquals("\n", createStream("\n").readLine())
        assertEquals("\r\n", createStream("\r\n").readLine())
    }

    @Test
    fun `test rest preserved`() {
        run {
            val stream = createStream("\nsome command input может быть с юникодом")

            assertEquals("\n", stream.readLine())
            assertEquals("some command input может быть с юникодом", stream.bufferedReader(charset).readText())
        }

        run {
            val stream = createStream(
                "some command может быть с юникодом\nsome command input может быть с юникодом"
            )

            assertEquals("some command может быть с юникодом\n", stream.readLine())
            assertEquals("some command input может быть с юникодом", stream.bufferedReader(charset).readText())
        }
    }

    @Test
    fun `test long line`() {
        val line = "a".repeat(4097) + "\n"
        val stream = createStream(line + "test")

        assertEquals(line, stream.readLine())
        assertEquals("test", stream.bufferedReader(charset).readText())
    }

    private fun createStream(content: String) =
        BufferedInputStream(ByteArrayInputStream(content.toByteArray(charset)))
}
