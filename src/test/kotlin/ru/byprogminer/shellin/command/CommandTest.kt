package ru.byprogminer.shellin.command

import ru.byprogminer.shellin.State
import java.io.BufferedInputStream
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.PrintStream


class CommandTest(
    private val state: State,
    input: String = "",
) {

    private companion object {

        val charset = Charsets.UTF_8
    }

    private val input: BufferedInputStream
    private val _output = ByteArrayOutputStream()
    private val _error = ByteArrayOutputStream()

    val output get() = _output.toByteArray().toString(charset).trimEnd('\n', '\r')
    val error get() = _error.toByteArray().toString(charset).trimEnd('\n', '\r')

    init {
        this.input = BufferedInputStream(ByteArrayInputStream(input.toByteArray(charset)))
    }

    fun Command.exec() {
        this.exec(input, PrintStream(_output), PrintStream(_error), state)
    }
}
