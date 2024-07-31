import { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../components/ui/Spinner";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { LuBadgeCheck } from "react-icons/lu";

const QuizApp = () => {
  const [questions, setQuestions] = useState(() => {
    const savedQuestions = localStorage.getItem("questions");
    return savedQuestions ? JSON.parse(savedQuestions) : [];
  });
  const [currentQuestion, setCurrentQuestion] = useState(() => {
    return parseInt(localStorage.getItem("currentQuestion") || "0");
  });
  const [answeredCount, setAnsweredCount] = useState(() => {
    const savedAnsweredQuestions = localStorage.getItem("answeredQuestions");
    return savedAnsweredQuestions
      ? JSON.parse(savedAnsweredQuestions).length
      : 0;
  });
  const [answeredQuestions, setAnsweredQuestions] = useState(() => {
    const savedAnsweredQuestions = localStorage.getItem("answeredQuestions");
    if (savedAnsweredQuestions) {
      return new Set(JSON.parse(savedAnsweredQuestions));
    } else {
      return new Set();
    }
  });

  const [score, setScore] = useState(() => {
    return parseInt(localStorage.getItem("quizScore") || "0");
  });
  const [showScore, setShowScore] = useState(false);
  const [timer, setTimer] = useState(() => {
    return parseInt(localStorage.getItem("quizTimer") || "30");
  });
  const [randomQuestions, setRandomQuestions] = useState([]);

  const reset = () => {
    setCurrentQuestion(0);
    setAnsweredQuestions(new Set());
    setScore(0);
    setTimer(30);
    setShowScore(false);
  };

  function decodeHtmlEntities(str) {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  }

  const clearQuizData = () => {
    localStorage.removeItem("questions");
    localStorage.removeItem("currentQuestion");
    localStorage.removeItem("answeredQuestions");
    localStorage.setItem("quizScore", "0");
    localStorage.setItem("quizTimer", "30");
    reset();
  };
  useEffect(() => {
    const savedQuestions = localStorage.getItem("questions");
    const savedTimer = localStorage.getItem("quizTimer");
    const savedScore = localStorage.getItem("quizScore");

    if (!savedQuestions || JSON.parse(savedQuestions).length === 0) {
      clearQuizData();
      fetchQuestions();
      setTimer(30);
      setScore(0);
    } else {
      setQuestions(JSON.parse(savedQuestions));
      setRandomQuestions(
        randomizeAnswers(JSON.parse(savedQuestions)[currentQuestion])
      );
      setTimer(savedTimer ? parseInt(savedTimer) : 30);
      setScore(savedScore ? parseInt(savedScore) : 0);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("quizQuestions", JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem("currentQuestion", currentQuestion.toString());
  }, [currentQuestion]);

  useEffect(() => {
    localStorage.setItem(
      "answeredQuestions",
      JSON.stringify([...answeredQuestions])
    );
  }, [answeredQuestions]);

  useEffect(() => {
    localStorage.setItem("quizScore", score.toString());
  }, [score]);

  useEffect(() => {
    localStorage.setItem("answeredCount", answeredCount.toString());
  }, [answeredCount]);

  useEffect(() => {
    if (timer > 0 && !showScore) {
      const timerId = setTimeout(() => {
        const newTimer = timer - 1;
        setTimer(newTimer);
        localStorage.setItem("quizTimer", newTimer.toString());
      }, 1000);
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
      const newQuestions = response.data.results;
      setQuestions(newQuestions);
      localStorage.setItem("questions", JSON.stringify(newQuestions));
      setRandomQuestions(randomizeAnswers(newQuestions[0]));
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
      const newScore = score + 1;

      setScore(newScore);
      localStorage.setItem("quizScore", newScore.toString());
    }

    setAnsweredQuestions((prev) => {
      const newAnswered = new Set(prev).add(currentQuestion);
      setAnsweredCount(newAnswered.size);
      return newAnswered;
    });
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
              <h1 className="text-4xl font-bold mb-4 ">Result</h1>
              <LuBadgeCheck className="w-24 h-24 text-blue-500" />
              <h2 className="text-3xl  text-blue-500 mb-4">Quiz Completed!</h2>
              <p className="text-xl mb-4">Your score : {score}</p>
              <div className="grid grid-cols-3 gap-x-10 p-8 m-8 w-full border border-purple-900">
                <div className="flex flex-col text-center">
                  <h1 className="font-semibold">Answered Questions</h1>
                  <p>{answeredCount}</p>
                </div>
                <div className="flex flex-col text-center">
                  <h1 className="font-semibold">Correct Answer</h1>
                  <p>{score}</p>
                </div>
                <div className="flex flex-col text-center">
                  <h1 className="font-semibold">Wrong Answer</h1>
                  <p>{questions.length - score}</p>
                </div>
              </div>
              <Link
                to="/dashboard"
                onClick={() => {
                  clearQuizData();
                }}
              >
                <Button>Done, take me back to home</Button>
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
                <h2 className="text-xl mb-4">
                  {decodeHtmlEntities(questions[currentQuestion].question)}
                </h2>
                <div className="space-y-2 flex-grow">
                  {randomQuestions.map((answer, index) => (
                    <button
                      key={index}
                      className="w-full p-2 text-left bg-blue-100 hover:bg-blue-200 rounded"
                      onClick={() => handleAnswerClick(answer)}
                    >
                      {decodeHtmlEntities(answer)}
                    </button>
                  ))}
                </div>
                <div className="mt-auto">
                  <button
                    onClick={() => {
                      setShowScore(true);
                      localStorage.setItem("quizScore", score.toString());
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
                            : "border-gray-300  border"
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
                            : "bg-rose-300 border"
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
