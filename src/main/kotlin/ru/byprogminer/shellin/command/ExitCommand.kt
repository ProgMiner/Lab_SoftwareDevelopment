package ru.byprogminer.shellin.command

import ru.byprogminer.shellin.State
import java.io.BufferedInputStream
import java.io.OutputStream
import java.io.PrintStream


/**
 * Stops the [State].
 */
class ExitCommand(
    private val args: List<String>,
) : Command {

    init {
        require(args.isNotEmpty())
    }

    override fun exec(input: BufferedInputStream, output: OutputStream, error: OutputStream, state: State) {
        if (args.size > 1) {
            PrintStream(error).println("Too many arguments.")
            return
        }

        state.stop()
    }
}
