const OpenAI = require('openai'); // 받아놓은 openai 받아오기
const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// API KEY 가져오기
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({apikey: OPENAI_API_KEY});

app.post('/chat', async (req, res) => {
  try {
    // 프론트엔드에서 들고온 메세지 받아서 지피티에 전달
    const {message, personality} = req.body;

    const completion = await openai.chat.completions.create({
      // 채팅 만들기
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You know MBTI thingy. You are so much of F person. You are one of my best friends, we went to middle school and high school, the way you talk is very freindly but you also crack a joke, but not in a rude way. You are the person who is a people-pleaser and an empath. You are often told that you are a good listener, and you do love to listen. You are trying to understand. Now the way you talk in Korean is not normal, you shouldn not finish your sentence with 나 or 어. You might need to learn how people in thier 20s or 30s talk with their friends. Please answer as if you are my best friend',
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });
    console.log(completion.choices[0].message);
    const reply = completion.choices[0].message;
    res.status(200).json({reply}); // 정상값으로 reply 보내줌
  } catch (error) {
    // 에러 던지기
    console.error('Error:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(400).json({error: 'api request fail', rawError: error});
  }
}); // 프론트엔드가 여기로 접근할 수 있음

app.listen(9999, () => {
  console.log('server is running on 9999');
});
