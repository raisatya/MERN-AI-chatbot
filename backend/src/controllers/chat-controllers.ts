import { ChatCompletionMessageParam } from 'openai/resources';
import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
import { OpenAI } from "openai";

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;

  try {
    // Fetch the user by ID from the JWT data
    const user = await User.findById(req.currentUser?.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
    }

    // Prepare the chat messages for the API request
    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    })) as ChatCompletionMessageParam[];

    // Add the new message from the user to the chat array
    chats.push({ content: message, role: "user" });
    user.chats.push({ content: message, role: "user" });

    // Configure OpenAI API
    const config = configureOpenAI();
    const openai = new OpenAI(config);

    // Request the chat completion from OpenAI API using GPT-4
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: chats,
    });

    // Add OpenAI's response to the user's chat history
    const assistantMessage = chatResponse.choices[0].message;
    user.chats.push(assistantMessage);
    await user.save();

    // Send the updated chat history as the response
    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
