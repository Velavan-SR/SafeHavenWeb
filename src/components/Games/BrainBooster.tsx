import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Check, ChevronRight, HelpCircle, X } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { quizQuestions } from '@/data/mockData';
import GameProgressManager from './GameProgressManager';

const LOCAL_STORAGE_KEY = 'brainBoosterProgress';

const BrainBooster: React.FC = () => {
  const navigate = useNavigate();
  const questions = quizQuestions.brainBooster;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setCurrentQuestionIndex(parsed.currentQuestionIndex || 0);
      setScore(parsed.score || 0);
      setQuizComplete(parsed.quizComplete || false);
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    const save = {
      currentQuestionIndex,
      score,
      quizComplete,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(save));
  }, [currentQuestionIndex, score, quizComplete]);

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === currentQuestion.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setShowExplanation(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizComplete(true);
      toast.success(`Quiz Complete!`, {
        description: `Your score: ${score} out of ${questions.length}`,
      });
    }
  };

  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };

  const handleReturnHome = () => {
    navigate('/games');
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setQuizComplete(false);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <Button 
        variant="ghost" 
        onClick={handleReturnHome}
        className="mb-4 hover:bg-safehaven-soft-purple"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Activities
      </Button>

      <Card className="w-full">
        {!quizComplete ? (
          <>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-safehaven-primary">Brain Booster Quiz</CardTitle>
                <div className="text-sm font-medium">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
              </div>
              <CardDescription>Test your knowledge on safety and legal rights</CardDescription>
              <Progress value={progress} className="h-2 mt-2" />
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-lg font-medium mb-6">{currentQuestion.question}</div>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`w-full justify-start text-left p-4 h-auto ${
                      selectedAnswer === option
                        ? option === currentQuestion.answer
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : 'bg-red-100 border-red-500 text-red-700'
                        : ''
                    }`}
                    onClick={() => handleAnswerSelect(option)}
                  >
                    <div className="flex items-center w-full">
                      <div className="flex-grow">{option}</div>
                      {isAnswered && selectedAnswer === option && (
                        <div className="ml-2">
                          {option === currentQuestion.answer ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>

              {isAnswered && (
                <div className="mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleExplanation}
                    className="mb-2"
                  >
                    <HelpCircle className="h-4 w-4 mr-1" />
                    {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                  </Button>

                  {showExplanation && (
                    <div className="p-3 bg-safehaven-soft-purple rounded-md text-sm">
                      <p><strong>Explanation:</strong> {currentQuestion.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between">
              <div className="text-sm text-safehaven-neutral-gray">
                Score: {score}/{currentQuestionIndex + (isAnswered ? 1 : 0)}
              </div>
              <Button
                onClick={handleNext}
                disabled={!isAnswered}
                className="bg-safehaven-primary text-white"
              >
                {currentQuestionIndex < questions.length - 1 ? (
                  <>
                    Next Question <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  'Complete Quiz'
                )}
              </Button>
            </CardFooter>
          </>
        ) : (
          <div className="p-6 text-center">
            <div className="mb-6">
              <Award className="h-16 w-16 text-safehaven-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-safehaven-primary">Quiz Complete!</h2>
              <p className="text-safehaven-neutral-gray mt-2">
                You scored {score} out of {questions.length}
              </p>
            </div>

            <div className="mb-8">
              {score >= questions.length * 0.8 ? (
                <div className="text-green-600 font-medium">
                  Excellent! You have great knowledge of safety and rights.
                </div>
              ) : score >= questions.length * 0.6 ? (
                <div className="text-yellow-600 font-medium">
                  Good job! You know quite a bit, but there's still room to learn more.
                </div>
              ) : (
                <div className="text-safehaven-neutral-gray font-medium">
                  You're making progress. Keep learning to stay safe and informed.
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <Button onClick={handleReturnHome} className="bg-safehaven-primary text-white">
                Return to Activities
              </Button>
              <Button variant="outline" onClick={handleRetake}>
                Retake Quiz
              </Button>
            </div>

            {/* GameProgressManager - Integrated here after quiz completion */}
            <GameProgressManager
              gameId="brainbooster"
              points={score}
              completed={true}
              stars={
                score >= questions.length * 0.8 ? 3 :
                score >= questions.length * 0.6 ? 2 :
                score >= questions.length * 0.4 ? 1 : 0
              }
              badges={[
                score >= questions.length * 0.8 ? 'Expert' :
                score >= questions.length * 0.6 ? 'Advanced' :
                score >= questions.length * 0.4 ? 'Intermediate' : 'Beginner',
              ]}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default BrainBooster;