import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen, Brain, HelpCircle, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";

const Knowledge = () => {
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({});
  const [showResults, setShowResults] = useState(false);

  const articles = [
    {
      title: "What is a Planet?",
      category: "Basics",
      readTime: "5 min",
      content: "A planet is a celestial body that orbits a star, has sufficient mass to assume a roughly spherical shape, and has cleared its orbital neighborhood of other objects. This definition, established by the International Astronomical Union in 2006, helps distinguish planets from other celestial bodies like asteroids and dwarf planets."
    },
    {
      title: "The Formation of Planetary Systems",
      category: "Science",
      readTime: "8 min",
      content: "Planetary systems form from collapsing clouds of gas and dust called nebulae. As the cloud contracts under gravity, it forms a rotating disk with a star at the center. Planets form from the leftover material in this disk through a process called accretion, where small particles stick together to form larger and larger objects."
    },
    {
      title: "Habitable Zones and Life",
      category: "Astrobiology",
      readTime: "6 min",
      content: "The habitable zone, or 'Goldilocks zone,' is the region around a star where liquid water could exist on a planet's surface. This zone varies depending on the star's temperature and size. Planets in this zone are considered the most likely candidates for hosting life as we know it."
    },
    {
      title: "Exoplanet Detection Methods",
      category: "Technology",
      readTime: "10 min",
      content: "Astronomers use several methods to detect exoplanets: the transit method observes dimming when planets pass in front of their stars, the radial velocity method detects wobbles in stellar motion, direct imaging captures light from planets, and gravitational microlensing uses gravity as a lens to magnify distant objects."
    },
    {
      title: "Rogue Planets: Wanderers of Space",
      category: "Discovery",
      readTime: "7 min",
      content: "Rogue planets are planetary-mass objects that orbit no star, wandering freely through space. They may have been ejected from their original solar systems or formed independently. These dark, cold worlds challenge our understanding of planetary formation and may be more common than previously thought."
    },
    {
      title: "The Search for Extraterrestrial Life",
      category: "Astrobiology",
      readTime: "12 min",
      content: "Scientists search for life beyond Earth by looking for biosignatures - signs of biological activity in planetary atmospheres. These might include oxygen, methane, or other gases that suggest the presence of living organisms. The James Webb Space Telescope is revolutionizing this search with unprecedented sensitivity."
    }
  ];

  const faqs = [
    {
      question: "How many exoplanets have been discovered?",
      answer: "As of 2024, over 5,000 exoplanets have been confirmed, with thousands more candidates awaiting verification. The Kepler Space Telescope and TESS mission have been instrumental in these discoveries."
    },
    {
      question: "What makes a planet habitable?",
      answer: "A habitable planet typically needs liquid water, a stable atmosphere, the right temperature range, and protection from harmful radiation. The planet's distance from its star, composition, and magnetic field all play crucial roles."
    },
    {
      question: "Could we ever travel to exoplanets?",
      answer: "With current technology, interstellar travel would take thousands of years. However, concepts like solar sails, fusion rockets, and even theoretical warp drives could potentially reduce travel times to decades or centuries in the future."
    },
    {
      question: "What are hot Jupiters?",
      answer: "Hot Jupiters are gas giant planets that orbit very close to their host stars, completing an orbit in just a few days. They're called 'hot' because their proximity to the star results in extremely high temperatures, often exceeding 1000°C."
    },
    {
      question: "How do we know the composition of exoplanets?",
      answer: "Scientists analyze the light from exoplanets using spectroscopy. When starlight passes through a planet's atmosphere, different molecules absorb specific wavelengths, creating a unique 'fingerprint' that reveals the atmospheric composition."
    }
  ];

  const quizQuestions = [
    {
      question: "Which planet is closest to the Sun?",
      options: ["Venus", "Mercury", "Earth", "Mars"],
      correct: 1,
      explanation: "Mercury is the innermost planet in our Solar System, orbiting at an average distance of 57.9 million kilometers from the Sun."
    },
    {
      question: "What method detected the first confirmed exoplanet around a Sun-like star?",
      options: ["Transit method", "Direct imaging", "Radial velocity", "Gravitational microlensing"],
      correct: 2,
      explanation: "The radial velocity method detected 51 Pegasi b in 1995, the first exoplanet found orbiting a main-sequence star like our Sun."
    },
    {
      question: "How many moons does Jupiter have?",
      options: ["79", "95", "67", "82"],
      correct: 1,
      explanation: "Jupiter has 95 confirmed moons as of 2024, making it the planet with the most moons in our Solar System."
    },
    {
      question: "What is the closest star system to Earth?",
      options: ["Alpha Centauri", "Sirius", "Proxima Centauri", "Barnard's Star"],
      correct: 0,
      explanation: "Alpha Centauri is the closest star system to Earth at 4.37 light-years away. Proxima Centauri is part of this system and is the closest individual star."
    },
    {
      question: "What defines the habitable zone around a star?",
      options: ["Where planets can have atmospheres", "Where liquid water can exist", "Where rocky planets form", "Where gas giants cannot exist"],
      correct: 1,
      explanation: "The habitable zone is the region around a star where temperatures allow liquid water to exist on a planet's surface - not too hot and not too cold."
    }
  ];

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const submitQuiz = () => {
    const score = quizQuestions.reduce((acc, question, index) => {
      return quizAnswers[index] === question.correct ? acc + 1 : acc;
    }, 0);
    
    setShowResults(true);
    toast(`Quiz completed! You scored ${score} out of ${quizQuestions.length}`);
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-cosmic">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <Link to="/">
              <Button variant="ghost" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient mb-4">
              Knowledge Hub
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Expand your understanding of planets, space exploration, and the cosmos through 
              educational articles, frequently asked questions, and interactive quizzes.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="articles" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="articles" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Articles
              </TabsTrigger>
              <TabsTrigger value="faqs" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                FAQs
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Quiz
              </TabsTrigger>
            </TabsList>

            {/* Articles Tab */}
            <TabsContent value="articles" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                  <Card 
                    key={article.title}
                    className="planet-card hover-lift animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{article.category}</Badge>
                        <span className="text-xs text-muted-foreground">{article.readTime}</span>
                      </div>
                      <CardTitle className="font-display text-lg">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {article.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* FAQs Tab */}
            <TabsContent value="faqs" className="space-y-4">
              {faqs.map((faq, index) => (
                <Card 
                  key={faq.question}
                  className="planet-card animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <CardTitle className="font-display text-lg text-primary">
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Quiz Tab */}
            <TabsContent value="quiz" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="font-display text-2xl font-bold mb-2">
                  Test Your Space Knowledge
                </h2>
                <p className="text-muted-foreground">
                  Answer these questions to test your understanding of planets and space exploration.
                </p>
              </div>

              <div className="space-y-6">
                {quizQuestions.map((question, questionIndex) => (
                  <Card 
                    key={questionIndex}
                    className="planet-card animate-fade-in"
                    style={{ animationDelay: `${questionIndex * 0.1}s` }}
                  >
                    <CardHeader>
                      <CardTitle className="font-display text-lg">
                        {questionIndex + 1}. {question.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = quizAnswers[questionIndex] === optionIndex;
                        const isCorrect = optionIndex === question.correct;
                        const showResult = showResults;
                        
                        return (
                          <Button
                            key={optionIndex}
                            variant={isSelected ? "default" : "outline"}
                            className={`w-full justify-start ${
                              showResult 
                                ? isCorrect 
                                  ? "bg-green-500/20 border-green-500 text-green-400 hover:bg-green-500/30" 
                                  : isSelected && !isCorrect
                                    ? "bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30"
                                    : ""
                                : ""
                            }`}
                            onClick={() => !showResults && handleQuizAnswer(questionIndex, optionIndex)}
                            disabled={showResults}
                          >
                            <div className="flex items-center gap-2">
                              {showResult && isCorrect && <CheckCircle className="h-4 w-4" />}
                              {showResult && isSelected && !isCorrect && <XCircle className="h-4 w-4" />}
                              {option}
                            </div>
                          </Button>
                        );
                      })}
                      
                      {showResults && (
                        <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                          <p className="text-sm text-muted-foreground">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center pt-6">
                {!showResults ? (
                  <Button 
                    onClick={submitQuiz}
                    className="btn-cosmic"
                    disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
                  >
                    Submit Quiz
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="text-lg font-semibold">
                      You scored {quizQuestions.reduce((acc, question, index) => {
                        return quizAnswers[index] === question.correct ? acc + 1 : acc;
                      }, 0)} out of {quizQuestions.length}!
                    </div>
                    <Button onClick={resetQuiz} variant="outline">
                      Take Quiz Again
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Knowledge;