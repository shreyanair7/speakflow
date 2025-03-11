
import { useState, useEffect, useRef } from "react";
import { 
  Mic, 
  Square, 
  AlertCircle, 
  HelpCircle, 
  VolumeX, 
  Volume2, 
  Info 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { AIChatbot } from "@/components/ai-chatbot";

const AnalysisPage = () => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState<number[]>([20, 30, 40, 60, 50, 35, 45, 55]);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [interimTranscript, setInterimTranscript] = useState("");
  
  // Speech recognition references
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Setup speech recognition
  const setupSpeechRecognition = () => {
    try {
      // Check browser support for Speech Recognition
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        toast({
          title: "Speech Recognition Not Supported",
          description: "Your browser doesn't support speech recognition. Try Chrome or Edge.",
          variant: "destructive"
        });
        return false;
      }

      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      // Set up event handlers
      recognition.onresult = (event) => {
        let interimTranscriptText = '';
        let finalTranscriptText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscriptText += transcript;
          } else {
            interimTranscriptText += transcript;
          }
        }

        if (finalTranscriptText) {
          setTranscript(prev => [...prev, finalTranscriptText]);
        }
        
        setInterimTranscript(interimTranscriptText);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        toast({
          title: "Recognition Error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive"
        });
      };

      recognitionRef.current = recognition;
      return true;
    } catch (error) {
      console.error("Error setting up speech recognition:", error);
      toast({
        title: "Setup Error",
        description: "Failed to initialize speech recognition.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let microphone: MediaStreamAudioSourceNode | null = null;
    let dataArray: Uint8Array | null = null;
    
    if (isRecording) {
      // Set up audio processing for visualizing levels
      const setupAudioProcessing = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          audioContext = new AudioContext();
          analyser = audioContext.createAnalyser();
          microphone = audioContext.createMediaStreamSource(stream);
          microphone.connect(analyser);
          analyser.fftSize = 256;
          const bufferLength = analyser.frequencyBinCount;
          dataArray = new Uint8Array(bufferLength);
          
          // Set up the interval to update the audio levels
          intervalRef.current = setInterval(() => {
            setRecordingTime((prev) => prev + 1);
            
            // Update audio level visualization
            if (analyser && dataArray) {
              analyser.getByteFrequencyData(dataArray);
              const average = Array.from(dataArray).reduce((sum, value) => sum + value, 0) / dataArray.length;
              const normalizedLevels = Array.from({ length: 8 }, () => 
                Math.min(Math.floor(average * (0.5 + Math.random() * 0.5)), 100)
              );
              setAudioLevel(normalizedLevels);
            }
          }, 1000);
        } catch (error) {
          console.error("Error setting up audio processing:", error);
          toast({
            title: "Microphone Error",
            description: "Failed to access microphone. Please check your permissions.",
            variant: "destructive"
          });
        }
      };
      
      setupAudioProcessing();
    }
    
    return () => {
      // Clean up
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      if (microphone) {
        microphone.disconnect();
      }
      
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [isRecording]);

  const toggleRecording = async () => {
    if (!isRecording) {
      // Start recording
      const success = setupSpeechRecognition();
      if (success) {
        setIsRecording(true);
        setRecordingTime(0);
        setTranscript([]);
        setInterimTranscript("");

        // Start the speech recognition
        if (recognitionRef.current) {
          recognitionRef.current.start();
        }
        
        toast({
          title: "Recording started",
          description: "Speak clearly into your microphone.",
        });
      }
    } else {
      // Stop recording
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Stop speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      toast({
        title: "Recording stopped",
        description: "Your recording has been analyzed.",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Real-time Analysis</h1>
        <p className="text-muted-foreground">
          Get instant feedback as you speak to improve your communication skills
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="border-2 border-navy-100 dark:border-navy-800 mb-6">
            <CardHeader>
              <CardTitle>Speech Recorder</CardTitle>
              <CardDescription>
                Record your speech to get real-time analysis and feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-6">
                <Button
                  onClick={toggleRecording}
                  size="lg"
                  className={`rounded-full h-20 w-20 ${
                    isRecording 
                      ? "bg-red-500 hover:bg-red-600" 
                      : "bg-navy-600 hover:bg-navy-700"
                  }`}
                >
                  {isRecording ? (
                    <Square className="h-8 w-8" />
                  ) : (
                    <Mic className="h-8 w-8" />
                  )}
                </Button>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-2xl font-bold">{formatTime(recordingTime)}</div>
                <p className="text-sm text-muted-foreground">
                  {isRecording ? "Recording in progress..." : "Ready to record"}
                </p>
              </div>
              
              <div className="h-16 flex items-end justify-between gap-1 mb-4">
                {audioLevel.map((level, index) => (
                  <div
                    key={index}
                    className={`w-full bg-navy-600 dark:bg-navy-400 rounded-t-md transition-all ${
                      isRecording ? "animate-wave" : ""
                    }`}
                    style={{ 
                      height: `${isRecording ? level : 5}%`, 
                      animationDelay: `${index * 0.1}s` 
                    }}
                  ></div>
                ))}
              </div>
              
              {!isRecording && recordingTime > 0 && (
                <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-md p-3 text-green-800 dark:text-green-200 text-sm">
                  Analysis complete! Scroll down to see your results.
                </div>
              )}
              
              {!isRecording && recordingTime === 0 && (
                <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-md p-3 text-blue-800 dark:text-blue-200 text-sm flex items-start space-x-2">
                  <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p>
                    Click the microphone button to start recording. Speak clearly and at a natural pace for the best analysis results.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Live Transcript Card */}
          <Card className="border-2 border-navy-100 dark:border-navy-800 mb-6">
            <CardHeader>
              <CardTitle>Live Transcript</CardTitle>
              <CardDescription>
                Real-time transcription of your speech
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-4 min-h-32 max-h-60 overflow-y-auto">
                {transcript.length > 0 || interimTranscript ? (
                  <div className="space-y-2">
                    {transcript.map((line, index) => (
                      <p key={index} className="text-slate-800 dark:text-slate-200">
                        {line}
                      </p>
                    ))}
                    {isRecording && interimTranscript && (
                      <p className="text-slate-500 dark:text-slate-400 italic">
                        {interimTranscript}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-slate-500 dark:text-slate-400 py-10">
                    {isRecording ? "Listening for speech..." : "No transcript available yet"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-2 border-navy-100 dark:border-navy-800 sticky top-20">
            <CardHeader>
              <CardTitle>AI Feedback</CardTitle>
              <CardDescription>
                Get personalized feedback on your speaking skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIChatbot />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
