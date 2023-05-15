package ru.byprogminer.chat

import Chat
import ChatServiceGrpcKt
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import java.time.LocalDateTime

class ChatService(private val username: String) : ChatServiceGrpcKt.ChatServiceCoroutineImplBase() {

    override fun connect(requests: Flow<Chat.ChatMessage>): Flow<Chat.ChatMessage> {
        runBlocking {
            launch {
                while (true) {
                    requests.collect { message ->
                        println("[${message.date}] ${message.username} : ${message.text}")
                    }
                }
            }
        }

        return flow {
            while (true) {
                val line = readLineSuspending()

                val message = Chat.ChatMessage.newBuilder()
                    .setUsername(username)
                    .setDate(LocalDateTime.now().format(DATE_TIME_FORMATTER))
                    .setText(line)
                    .build()

                emit(message)
            }
        }
    }
}