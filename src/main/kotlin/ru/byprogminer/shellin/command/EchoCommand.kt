package ru.byprogminer.shellin.command

import ru.byprogminer.shellin.State
import java.io.InputStream
import java.io.OutputStream
import java.io.PrintStream


/**
 * Prints arguments joined with space.
 */
class EchoCommand(
    private val args: List<String>,
) : Command {

    override fun exec(input: InputStream, output: OutputStream, error: OutputStream, state: State) {
        val result = args.subList(1, args.size).joinToString(" ")
        PrintStream(output).println(result)
    }
}
