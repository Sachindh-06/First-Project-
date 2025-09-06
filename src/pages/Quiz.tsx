import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Clock, User, RotateCcw } from "lucide-react";
import { AuthForm } from "@/components/AuthForm";

interface QuizQuestion {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  category: string;
}

interface QuizResult {
  id: string;
  score: number;
  total_questions: number;
  submitted_at: string;
}

export default function Quiz() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchQuizResults();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleNextQuestion();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, quizCompleted]);

  const fetchQuizResults = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', user?.id)
        .order('submitted_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Error fetching quiz results:', error);
    }
  };

  const startQuiz = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .limit(5)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Shuffle questions
      const shuffled = (data || []).sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setQuizStarted(true);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setQuizCompleted(false);
      setScore(0);
      setTimeLeft(30);
    } catch (error) {
      console.error('Error starting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to load quiz questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestionIndex === questions.length - 1) {
      // Quiz completed
      const finalScore = newAnswers.reduce((score, answer, index) => {
        return score + (answer === questions[index]?.correct_option ? 1 : 0);
      }, 0);
      
      setScore(finalScore);
      setQuizCompleted(true);
      
      // Save result to database
      try {
        const { error } = await supabase
          .from('quiz_results')
          .insert({
            user_id: user?.id,
            quiz_id: questions[0]?.id, // Use first question's ID as reference
            score: finalScore,
            total_questions: questions.length,
          });

        if (error) throw error;
        
        toast({
          title: "Quiz Completed!",
          description: `You scored ${finalScore}/${questions.length}`,
        });
        
        fetchQuizResults();
      } catch (error) {
        console.error('Error saving quiz result:', error);
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setTimeLeft(30);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setAnswers([]);
    setScore(0);
    setTimeLeft(30);
  };

  if (!isAuthenticated) {
    return <AuthForm onSuccess={() => window.location.reload()} />;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-space pt-20 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Space Quiz
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Test your knowledge about planets, missions, and space exploration
          </p>
        </div>

        {!quizStarted ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Start Quiz */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl font-orbitron">Ready to Explore?</CardTitle>
                <CardDescription>
                  Challenge yourself with 5 randomized questions about space
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <p>• 5 questions per quiz</p>
                    <p>• 30 seconds per question</p>
                    <p>• Questions about planets, missions, and space tech</p>
                    <p>• Your progress is tracked and saved</p>
                  </div>
                  <Button
                    onClick={startQuiz}
                    disabled={loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? "Loading..." : "Start Quiz"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Previous Results */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl font-orbitron flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-primary" />
                  Your Results
                </CardTitle>
                <CardDescription>
                  Track your quiz performance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.length > 0 ? (
                  <div className="space-y-3">
                    {results.map((result) => (
                      <div
                        key={result.id}
                        className="flex items-center justify-between p-3 bg-primary/10 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {result.score}/{result.total_questions}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(result.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant={result.score >= result.total_questions * 0.8 ? "default" : "secondary"}
                        >
                          {Math.round((result.score / result.total_questions) * 100)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No quiz results yet. Take your first quiz!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : quizCompleted ? (
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20 max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-orbitron text-primary">
                Quiz Completed!
              </CardTitle>
              <CardDescription>
                Here are your results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-6">
                <div className="text-6xl font-bold text-primary">
                  {score}/{questions.length}
                </div>
                <div>
                  <Badge
                    variant={score >= questions.length * 0.8 ? "default" : "secondary"}
                    className="text-lg px-4 py-2"
                  >
                    {Math.round((score / questions.length) * 100)}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  {score === questions.length && (
                    <p className="text-green-400 font-medium">Perfect Score! 🚀</p>
                  )}
                  {score >= questions.length * 0.8 && score < questions.length && (
                    <p className="text-blue-400 font-medium">Excellent Work! 🌟</p>
                  )}
                  {score >= questions.length * 0.6 && score < questions.length * 0.8 && (
                    <p className="text-yellow-400 font-medium">Good Job! 👍</p>
                  )}
                  {score < questions.length * 0.6 && (
                    <p className="text-orange-400 font-medium">Keep Learning! 📚</p>
                  )}
                </div>
                <Button onClick={resetQuiz} className="w-full" size="lg">
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Take Another Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20 max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-orbitron">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </CardTitle>
                  <Badge variant="outline" className="mt-2">
                    {currentQuestion?.category}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-2 text-primary">
                    <Clock className="h-5 w-5" />
                    <span className="text-2xl font-bold">{timeLeft}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">seconds</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {currentQuestion && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
                  
                  <div className="space-y-3">
                    {[
                      { key: 'A', text: currentQuestion.option_a },
                      { key: 'B', text: currentQuestion.option_b },
                      { key: 'C', text: currentQuestion.option_c },
                      { key: 'D', text: currentQuestion.option_d },
                    ].map((option) => (
                      <button
                        key={option.key}
                        onClick={() => setSelectedAnswer(option.key)}
                        className={`w-full p-4 text-left rounded-lg border transition-all ${
                          selectedAnswer === option.key
                            ? 'border-primary bg-primary/20'
                            : 'border-primary/20 hover:border-primary/40'
                        }`}
                      >
                        <span className="font-medium text-primary">{option.key}.</span> {option.text}
                      </button>
                    ))}
                  </div>

                  <Button
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswer}
                    className="w-full"
                    size="lg"
                  >
                    {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}