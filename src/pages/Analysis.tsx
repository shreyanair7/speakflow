
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
  const [fillerWords, setFillerWords] = useState<string[]>([]);
  const [pace, setPace] = useState(0);
  const [clarity, setClarity] = useState(0);
  const [tone, setTone] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [transcript, setTranscript] = useState<string[]>([]);
  
  // New state for audio recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to request microphone access and set up recording
  const setupRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up event handlers for the media recorder
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        processAudio();
      };
      
      return true;
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use this feature.",
      });
      return false;
    }
  };
  
  // Function to process recorded audio with Whisper API
  const processAudio = async () => {
    if (audioChunksRef.current.length === 0) return;
    
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('model', 'whisper-1');
    
    try {
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY || ''}`,
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.text) {
        // Add the new transcription to the transcript array
        setTranscript(prevTranscript => [...prevTranscript, data.text]);
      }
    } catch (error) {
      console.error("Error transcribing audio:", error);
      toast({
        title: "Transcription error",
        description: "Failed to transcribe audio. Please try again.",
        variant: "destructive",
      });
    }
    
    // Clear the audio chunks for the next recording
    audioChunksRef.current = [];
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
          
          // Start recording
          if (mediaRecorderRef.current) {
            mediaRecorderRef.current.start(2000); // Collect data every 2 seconds
          }
          
          // Set up the interval to update the audio levels and process chunks
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
            
            // Simulate other metrics updates (this would be replaced with real analysis in production)
            updateMetrics();
          }, 1000);
        } catch (error) {
          console.error("Error setting up audio processing:", error);
        }
      };
      
      setupAudioProcessing();
    }
    
    return () => {
      // Clean up
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      
      if (microphone) {
        microphone.disconnect();
      }
      
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [isRecording]);

  // Function to simulate updating metrics (would be replaced with real analysis)
  const updateMetrics = () => {
    // Simulate pace, clarity, and tone updates
    setPace(prev => Math.min(100, prev + Math.floor(Math.random() * 5)));
    setClarity(prev => Math.min(100, prev + Math.floor(Math.random() * 4)));
    setTone(prev => Math.min(100, prev + Math.floor(Math.random() * 3)));
    
    // Simulate detecting filler words
    if (Math.random() > 0.8) {
      const fillers = ["um", "uh", "like", "you know", "actually"];
      const newFiller = fillers[Math.floor(Math.random() * fillers.length)];
      setFillerWords(prev => [...prev, newFiller]);
    }
    
    // Simulate feedback
    if (Math.random() > 0.9 && feedback.length < 3) {
      const feedbackOptions = [
        "Try to speak slower for better clarity",
        "Great job on varying your tone",
        "Consider adding more pauses for emphasis",
        "Your pronunciation is improving"
      ];
      const newFeedback = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
      if (!feedback.includes(newFeedback)) {
        setFeedback(prev => [...prev, newFeedback]);
      }
    }
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      // Start recording
      const success = await setupRecording();
      if (success) {
        setIsRecording(true);
        setRecordingTime(0);
        setFillerWords([]);
        setPace(0);
        setClarity(0);
        setTone(0);
        setFeedback([]);
        setTranscript([]);
        
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
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
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
          {(isRecording || recordingTime > 0) && (
            <Card className="border-2 border-navy-100 dark:border-navy-800 mb-6">
              <CardHeader>
                <CardTitle>Live Transcript</CardTitle>
                <CardDescription>
                  Real-time transcription of your speech using Whisper API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-4 min-h-32 max-h-52 overflow-y-auto">
                  {transcript.length > 0 ? (
                    <div className="space-y-2">
                      {transcript.map((line, index) => (
                        <p key={index} className="text-slate-800 dark:text-slate-200">
                          {line}
                        </p>
                      ))}
                      {isRecording && (
                        <div className="flex items-center">
                          <span className="text-navy-600 dark:text-navy-400 font-medium">
                            Listening
                          </span>
                          <span className="animate-pulse ml-1">...</span>
                        </div>
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
          )}

          {(isRecording || recordingTime > 0) && (
            <Card className="border-2 border-navy-100 dark:border-navy-800">
              <CardHeader>
                <CardTitle>Real-time Metrics</CardTitle>
                <CardDescription>
                  Live analysis of your speaking performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Speaking Pace</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-60">
                              Measures if you're speaking too quickly or too slowly. Aim for a balanced, natural pace.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="text-sm font-medium">
                      {pace < 30 ? "Too Slow" : pace > 70 ? "Too Fast" : "Good"}
                    </span>
                  </div>
                  <Progress value={pace} className="h-2" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Clarity</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-60">
                              Measures how clearly you articulate words and maintain consistent volume.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="text-sm font-medium">
                      {clarity < 40 ? "Needs Work" : clarity > 70 ? "Excellent" : "Good"}
                    </span>
                  </div>
                  <Progress value={clarity} className="h-2" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Tone Variation</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-60">
                              Measures how well you vary your tone to maintain audience engagement.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="text-sm font-medium">
                      {tone < 30 ? "Monotone" : tone > 70 ? "Dynamic" : "Average"}
                    </span>
                  </div>
                  <Progress value={tone} className="h-2" />
                </div>
                
                <div className="pt-2">
                  <h3 className="font-medium mb-3">Filler Words Detected</h3>
                  {fillerWords.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {fillerWords.map((word, index) => (
                        <Badge key={index} variant="secondary" className="text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300">
                          "{word}" at {formatTime(index * 3 + 5)}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No filler words detected yet.</p>
                  )}
                </div>
                
                {feedback.length > 0 && (
                  <div className="pt-2">
                    <h3 className="font-medium mb-3">Live Feedback</h3>
                    <div className="space-y-2">
                      {feedback.map((item, index) => (
                        <div key={index} className="bg-navy-50 dark:bg-navy-900 p-3 rounded-md text-sm">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
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
