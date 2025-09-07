import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Brain, CheckCircle, XCircle, Rocket, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import FloatingChatbot from '@/components/FloatingChatbot';

interface QuizQuestion {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  category: string;
  difficulty: string;
  created_at: string;
}

const Quiz = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (quizStarted) {
      loadRandomQuestions();
    }
  }, [quizStarted]);

  const loadRandomQuestions = async () => {
    try {
      const { data: allQuizzes, error } = await supabase
        .from('quizzes')
        .select('*');

      if (error) throw error;

      if (allQuizzes && allQuizzes.length > 0) {
        // Shuffle and take 5 random questions
        const shuffled = [...allQuizzes].sort(() => Math.random() - 0.5);
        setQuestions(shuffled.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      // Fallback questions if database is unavailable
      setQuestions([
        {
          id: '1',
          question: 'Which planet is known as the Red Planet?',
          option_a: 'Venus',
          option_b: 'Mars',
          option_c: 'Jupiter',
          option_d: 'Saturn',
          correct_option: 'option_b',
          category: 'planets',
          difficulty: 'easy',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          question: 'What is the largest planet in our solar system?',
          option_a: 'Earth',
          option_b: 'Saturn',
          option_c: 'Jupiter',
          option_d: 'Neptune',
          correct_option: 'option_c',
          category: 'planets',
          difficulty: 'easy',
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          question: 'Which space agency launched the Chandrayaan missions?',
          option_a: 'NASA',
          option_b: 'ESA',
          option_c: 'ISRO',
          option_d: 'SpaceX',
          correct_option: 'option_c',
          category: 'missions',
          difficulty: 'medium',
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async () => {
    const score = calculateScore();
    setShowResults(true);
    
    toast({
      title: "Quiz Completed!",
      description: `You scored ${score}/${questions.length}! Try again for new questions.`,
    });
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === questions[index]?.correct_option ? 1 : 0);
    }, 0);
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answer;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const resetQuiz = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizStarted(false);
    setLoading(false);
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setLoading(true);
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-cosmic">
        <Navigation />
        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16">
              <h1 className="font-display text-4xl md:text-6xl font-bold text-gradient mb-6">
                Space Quizzes
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Test your knowledge about space, planets, missions, and cosmic phenomena. 
                New questions every time you play!
              </p>
              
              <Card className="planet-card max-w-lg mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 justify-center">
                    <Brain className="h-6 w-6 text-primary" />
                    Ready to Test Your Knowledge?
                  </CardTitle>
                  <CardDescription>
                    5 randomized questions about space exploration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-left space-y-2 text-sm text-muted-foreground mb-6">
                    <li>• Questions about planets, missions, and space technology</li>
                    <li>• Randomized questions each time you play</li>
                    <li>• Immediate feedback on your answers</li>
                    <li>• No account required - just pure learning fun!</li>
                  </ul>
                  <Button onClick={startQuiz} className="btn-cosmic w-full">
                    <Rocket className="mr-2 h-5 w-5" />
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <FloatingChatbot />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmic">
        <Navigation />
        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card className="planet-card">
              <CardContent className="py-16">
                <div className="text-center">
                  <Brain className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
                  <h2 className="text-xl font-semibold mb-2">Loading Questions...</h2>
                  <p className="text-muted-foreground">Preparing your space quiz</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <FloatingChatbot />
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-cosmic">
        <Navigation />
        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card className="planet-card">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-display text-gradient mb-2">
                  Quiz Complete!
                </CardTitle>
                <CardDescription>Here's how you did</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-4">
                    {score}/{questions.length}
                  </div>
                  <Badge 
                    variant={percentage >= 80 ? "default" : percentage >= 60 ? "secondary" : "outline"}
                    className="text-lg px-4 py-2"
                  >
                    {percentage}%
                  </Badge>
                </div>

                {/* Answer Review */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-center">Review Your Answers</h3>
                  {questions.map((q, index) => {
                    const isCorrect = selectedAnswers[index] === q.correct_option;
                    return (
                      <div 
                        key={q.id}
                        className={`p-4 rounded-lg border ${
                          isCorrect ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium mb-2">{q.question}</p>
                            <p className="text-sm text-muted-foreground">
                              Correct answer: {q[q.correct_option as keyof QuizQuestion]}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Button onClick={resetQuiz} className="btn-cosmic w-full">
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Try Again with New Questions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <FloatingChatbot />
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-cosmic">
      <Navigation />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="planet-card">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline">{question?.category}</Badge>
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>
              <Progress value={progress} className="mb-4" />
              <CardTitle className="text-xl">{question?.question}</CardTitle>
            </CardHeader>
            
            <CardContent>
              <RadioGroup 
                value={selectedAnswers[currentQuestion] || ""} 
                onValueChange={handleAnswerSelect}
                className="space-y-3"
              >
                {['option_a', 'option_b', 'option_c', 'option_d'].map((option, index) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="flex-1 cursor-pointer">
                      <span className="font-medium text-primary mr-2">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {question?.[option as keyof QuizQuestion]}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              {currentQuestion === questions.length - 1 ? (
                <Button 
                  onClick={submitQuiz}
                  disabled={!selectedAnswers[currentQuestion]}
                  className="btn-cosmic"
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button 
                  onClick={nextQuestion}
                  disabled={!selectedAnswers[currentQuestion]}
                  className="btn-cosmic"
                >
                  Next
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
      <FloatingChatbot />
    </div>
  );
};

export default Quiz;