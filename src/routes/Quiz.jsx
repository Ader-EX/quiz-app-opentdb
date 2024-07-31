import { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../components/ui/Spinner";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());

  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timer, setTimer] = useState(9000);
  const [randomQuestions, setRandomQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timer > 0 && !showScore) {
      const timerId = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timer === 0) {
      setShowScore(true);
    }
  }, [timer, showScore]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        "https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple"
      );

      console.log(response.data.results.length);
      setQuestions(response.data.results);
      setRandomQuestions(randomizeAnswers(response.data.results[0]));
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleQuestionChange = (i) => {
    setCurrentQuestion(i);
    setRandomQuestions(randomizeAnswers(questions[i]));
  };

  const handleAnswerClick = (answer) => {
    if (answer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }
    setAnsweredQuestions((prev) => new Set(prev).add(currentQuestion));
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setRandomQuestions(randomizeAnswers(questions[nextQuestion]));
    } else {
      setShowScore(true);
    }
  };

  const randomizeAnswers = (question) => {
    return [...question.incorrect_answers, question.correct_answer].sort(
      () => Math.random() - 0.5
    );
  };

  if (questions.length === 0) {
    return (
      <div className=" flex flex-col w-screen gap-y-2 h-screen justify-center items-center">
        <Spinner />
        <h1>Loading.....</h1>
      </div>
    );
  }

  return (
    <div className="">
      <div>
        {showScore ? (
          <div className="flex items-center justify-center w-full h-full mt-10">
            <div className="text-center flex flex-col items-center justify-center  p-4">
              <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
              <p className="text-xl mb-4">
                Your score: {score} out of {questions.length}
              </p>
              <Link to="/dashboard">
                <Button>Done</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row h-screen">
              <div className="md:w-4/6 w-full h-full p-8 bg-gray-100 flex flex-col">
                <div className="mb-4">
                  <p className="text-xl font-semibold">
                    Question {currentQuestion + 1}/{questions.length}
                  </p>
                  <p className="text-lg font-medium mt-2">
                    Time remaining: {timer}s
                  </p>
                </div>
                <h2
                  className="text-xl mb-4"
                  dangerouslySetInnerHTML={{
                    __html: questions[currentQuestion].question,
                  }}
                ></h2>
                <div className="space-y-2 flex-grow">
                  {randomQuestions.map((answer, index) => (
                    <button
                      key={index}
                      className="w-full p-2 text-left bg-blue-100 hover:bg-blue-200 rounded"
                      onClick={() => handleAnswerClick(answer)}
                      dangerouslySetInnerHTML={{ __html: answer }}
                    ></button>
                  ))}
                </div>
                <div className="mt-auto">
                  <button
                    onClick={() => {
                      setShowScore(true);
                    }}
                    className="flex-end px-4 py-2 bg-rose-900 text-white rounded-lg"
                  >
                    Finish The Test
                  </button>
                </div>
              </div>
              <div className="p-4  md:w-2/6 w-full  ">
                <h1 className="mb-4 font-semibold">Question List</h1>
                <div className="flex flex-wrap gap-2  ">
                  {questions.map((_, index) => (
                    <div key={index} className="flex-flex-col">
                      <button
                        key={index}
                        className={`w-10 h-10 rounded-t rounded-b-none ${
                          index === currentQuestion
                            ? "border-blue-500 border  text-blue-500"
                            : "border-gray-300 border"
                        }`}
                        onClick={() => handleQuestionChange(index)}
                      >
                        {index + 1}
                      </button>
                      <div
                        className={`p-1 rounded-b rounded-t-none ${
                          index === currentQuestion
                            ? "bg-blue-600 text-white"
                            : answeredQuestions.has(index)
                            ? "bg-green-500 "
                            : "border-gray-300 border"
                        }`}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizApp;
