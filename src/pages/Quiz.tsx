import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  RotateCcw,
  Trophy,
  XCircle,
} from 'lucide-react';
import {
  createQuizSession,
  getQuizHistory,
  getShortcuts,
} from '@/lib/firebase';
import { useToast } from '@/contexts/ToastContext';
import { Link } from 'wouter';
import type { QuizSession, Shortcut } from '@/lib/types';
import { demoUserId } from '@/lib/env';

interface QuizQuestion {
  shortcut: Shortcut;
  options: string[];
  correctAnswer: string;
}

export default function QuizPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [timerActive, setTimerActive] = useState(false);
  const { toast } = useToast();
  const userId = demoUserId;
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizSession[]>([]);
  useEffect(() => {
    const fetchShortcuts = async () => {
      try {
        const data = await getShortcuts();
        setShortcuts(data);
      } catch (error) {
        console.error('Error fetching shortcuts:', error);
      }
    };

    fetchShortcuts();
  }, []);

  useEffect(() => {
    const fetchQuizHistory = async () => {
      try {
        const data = await getQuizHistory(userId);
        setQuizHistory(data);
      } catch (error) {
        console.error('Error fetching quiz history:', error);
      }
    };

    fetchQuizHistory();
  }, [userId]);
  const saveQuizSession = async (sessionData: {
    userId: number;
    platform: string;
    score: number;
    totalQuestions: number;
    completedAt: string;
  }) => {
    try {
      await createQuizSession(
        sessionData.userId,
        sessionData.platform,
        sessionData.score,
        sessionData.totalQuestions,
        sessionData.completedAt,
      );

      const updatedHistory = await getQuizHistory(userId);
      setQuizHistory(updatedHistory);

      toast({
        title: 'Quiz completado',
        description: 'Tu puntuación ha sido guardada.',
      });
    } catch (error) {
      console.error('Error saving quiz session:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la puntuación.',
      });
    }
  };

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && timerActive) {
      handleQuizComplete();
    }
  }, [timeLeft, timerActive]);

  const platforms = [
    { id: 'phpstorm', name: 'PHPStorm', color: '#9333ea' },
    { id: 'archlinux', name: 'ArchLinux', color: '#1677ff' },
    { id: 'ubuntu', name: 'Ubuntu', color: '#e97317' },
  ];

  const generateRandomOptions = (
    correctAnswer: string,
    allShortcuts: Shortcut[],
  ): string[] => {
    const wrongAnswers = allShortcuts
      .filter((s) => s.shortcut !== correctAnswer)
      .map((s) => s.shortcut)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [correctAnswer, ...wrongAnswers].sort(
      () => 0.5 - Math.random(),
    );
    return options;
  };

  const startQuiz = (platform: string) => {
    const platformShortcuts = shortcuts.filter(
      (s: Shortcut) => s.platform === platform,
    );

    if (platformShortcuts.length < 10) {
      toast({
        title: 'Insuficientes shortcuts',
        description: 'Se necesitan al menos 10 shortcuts para crear un quiz.',
      });
      return;
    }

    const selectedShortcuts = platformShortcuts
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);

    const quizQuestions: QuizQuestion[] = selectedShortcuts.map((shortcut) => ({
      shortcut,
      options: generateRandomOptions(shortcut.shortcut, platformShortcuts),
      correctAnswer: shortcut.shortcut,
    }));

    setQuestions(quizQuestions);
    setSelectedPlatform(platform);
    setQuizStarted(true);
    setQuizCompleted(false);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setSelectedAnswer('');
    setScore(0);
    setTimeLeft(300);
    setTimerActive(true);
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return;

    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    setTimerActive(false);
    setQuizCompleted(true);

    const finalScore = userAnswers.filter(
      (answer, index) => answer === questions[index]?.correctAnswer,
    ).length;

    saveQuizSession({
      userId,
      platform: selectedPlatform,
      score: finalScore,
      totalQuestions: questions.length,
      completedAt: new Date().toISOString(),
    });
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setSelectedPlatform('');
    setCurrentQuestion(0);
    setUserAnswers([]);
    setSelectedAnswer('');
    setScore(0);
    setTimerActive(false);
    setTimeLeft(300);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!quizStarted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Modo Práctica</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Pon a prueba tu conocimiento de shortcuts con nuestro quiz
              interactivo
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Selecciona una plataforma
              </h2>
              <div className="space-y-3">
                {platforms.map((platform) => (
                  <Card
                    key={platform.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => startQuiz(platform.id)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: platform.color }}
                        />
                        {platform.name}
                      </CardTitle>
                      <CardDescription>
                        {
                          shortcuts.filter(
                            (s: Shortcut) => s.platform === platform.id,
                          ).length
                        }{' '}
                        shortcuts disponibles
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Historial de Quiz</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {quizHistory.length > 0 ? (
                  quizHistory.map((session: QuizSession) => (
                    <Card key={session.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <Badge variant="outline" className="mb-1">
                              {session.platform}
                            </Badge>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(
                                session.completedAt,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-semibold ${getScoreColor(session.score, session.totalQuestions)}`}
                            >
                              {session.score}/{session.totalQuestions}
                            </p>
                            <p className="text-sm text-gray-500">
                              {Math.round(
                                (session.score / session.totalQuestions) * 100,
                              )}
                              %
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No hay historial de quiz aún
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/shortcuts">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Shortcuts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const finalScore = userAnswers.filter(
      (answer, index) => answer === questions[index]?.correctAnswer,
    ).length;
    const percentage = Math.round((finalScore / questions.length) * 100);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h1 className="text-3xl font-bold mb-2">¡Quiz Completado!</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Has terminado el quiz de {selectedPlatform}
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-6xl font-bold mb-2 text-blue-600">
                {percentage}%
              </div>
              <p className="text-lg mb-4">
                {finalScore} de {questions.length} respuestas correctas
              </p>
              <Progress value={percentage} className="w-full" />
            </CardContent>
          </Card>

          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold">Revisión de Respuestas</h3>
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;

              return (
                <Card
                  key={index}
                  className={`border-l-4 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium mb-1">
                          {question.shortcut.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {question.shortcut.description}
                        </p>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">Tu respuesta:</span>
                            <span
                              className={
                                isCorrect ? 'text-green-600' : 'text-red-600'
                              }
                            >
                              {userAnswer || 'Sin respuesta'}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm">
                              <span className="font-medium">
                                Respuesta correcta:
                              </span>
                              <span className="text-green-600">
                                {question.correctAnswer}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-500" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={resetQuiz}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Nuevo Quiz
            </Button>
            <Link href="/shortcuts">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Shortcuts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Quiz - {selectedPlatform}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Pregunta {currentQuestion + 1} de {questions.length}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
            <Progress
              value={(currentQuestion / questions.length) * 100}
              className="w-32"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {questions[currentQuestion]?.shortcut.title}
            </CardTitle>
            <CardDescription>
              {questions[currentQuestion]?.shortcut.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">
                ¿Cuál es el shortcut correcto?
              </h3>
              <RadioGroup
                value={selectedAnswer}
                onValueChange={setSelectedAnswer}
              >
                {questions[currentQuestion]?.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label
                      htmlFor={`option-${index}`}
                      className="font-mono text-sm cursor-pointer flex-1 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={resetQuiz}>
                Cancelar Quiz
              </Button>
              <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer}>
                {currentQuestion + 1 === questions.length
                  ? 'Finalizar'
                  : 'Siguiente'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center text-sm text-gray-500">
          Puntuación actual: {score} / {currentQuestion + 1}
        </div>
      </div>
    </div>
  );
}
