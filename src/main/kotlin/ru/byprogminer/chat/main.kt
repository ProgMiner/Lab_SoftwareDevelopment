package ru.byprogminer.chat

import Chat
import ChatServiceGrpcKt
import io.grpc.ManagedChannelBuilder
import io.grpc.ServerBuilder
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter


val DATE_TIME_FORMATTER: DateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")

suspend fun readLineSuspending() = withContext(Dispatchers.IO) { readLine() }

fun runServer(username: String, port: Int) {
    val service = ChatService(username)

    println("Running on $port")

    val server = ServerBuilder.forPort(port)
        .addService(service).build()

    Runtime.getRuntime().addShutdownHook(Thread {
        server.shutdown()
        server.awaitTermination()
    })

    server.start()
    server.awaitTermination()
}

fun runClient(username: String, host: String, port: Int) {
    val channel = ManagedChannelBuilder.forAddress(host, port)
        .usePlaintext().build()

    val stub = ChatServiceGrpcKt.ChatServiceCoroutineStub(channel)

    val requestFlow = stub.connect(flow {
        while (true) {
            val line = readLineSuspending()

            val message = Chat.ChatMessage.newBuilder()
                .setUsername(username)
                .setDate(LocalDateTime.now().format(DATE_TIME_FORMATTER))
                .setText(line)
                .build()

            println("Sending message")
            emit(message)
        }
    })

    runBlocking(Dispatchers.IO) {
        while (true) {
            requestFlow.collect { message ->
                println("[${message.date}] ${message.username} : ${message.text}")
            }
        }
    }
}

fun main(args: Array<String>) {
    if (args.size == 2) {
        runServer(args[0], args[1].toInt())
        return
    }

    runClient(args[0], args[1], args[2].toInt())
}
