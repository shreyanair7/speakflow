
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Play, Download, MoreVertical, Search, Filter, Calendar, CheckCircle2, Activity, VolumeX, BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SpeechRecord {
  id: number;
  title: string;
  date: string;
  duration: string;
  type: string;
  rating: string;
  fillerCount: number;
  clarity: number;
  pace: number;
  sentiment?: number;
  confidence?: number;
  tone?: string;
  fillerWords?: string[];
  transcript?: string;
}

const HistoryPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [speechHistory, setSpeechHistory] = useState<SpeechRecord[]>([]);
  const [selectedSpeech, setSelectedSpeech] = useState<SpeechRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  // Load speech history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('speechHistory');
    if (savedHistory) {
      setSpeechHistory(JSON.parse(savedHistory));
    }
  }, []);
  
  // Filter speech history based on search term
  const filteredHistory = speechHistory.filter(speech => 
    speech.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (speech.transcript && speech.transcript.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Badge color based on rating
  const getRatingBadgeColor = (rating: string) => {
    switch (rating) {
      case "Excellent":
        return "bg-green-500 hover:bg-green-600";
      case "Good":
        return "bg-blue-500 hover:bg-blue-600";
      case "Needs Work":
        return "bg-amber-500 hover:bg-amber-600";
      default:
        return "";
    }
  };

  // Badge color for metrics
  const getMetricBadgeColor = (value: number) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-blue-500";
    if (value >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  // Delete speech record
  const deleteSpeechRecord = (id: number) => {
    const updatedHistory = speechHistory.filter(speech => speech.id !== id);
    setSpeechHistory(updatedHistory);
    localStorage.setItem('speechHistory', JSON.stringify(updatedHistory));
    
    toast({
      title: "Recording deleted",
      description: "The speech recording has been removed from your history."
    });
  };

  // View speech details
  const viewSpeechDetails = (speech: SpeechRecord) => {
    setSelectedSpeech(speech);
    setDetailsOpen(true);
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Speech History</h1>
        <p className="text-muted-foreground">
          Review your past recordings and track your improvement over time
        </p>
      </div>

      <Card className="border-2 border-navy-100 dark:border-navy-800 mb-8">
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title or content"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter by Type
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>All Types</DropdownMenuItem>
                <DropdownMenuItem>Uploaded</DropdownMenuItem>
                <DropdownMenuItem>Real-time</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <Calendar className="mr-2 h-4 w-4" />
                  Date Range
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>All Time</DropdownMenuItem>
                <DropdownMenuItem>Last 7 Days</DropdownMenuItem>
                <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
                <DropdownMenuItem>Last 90 Days</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Rating
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>All Ratings</DropdownMenuItem>
                <DropdownMenuItem>Excellent</DropdownMenuItem>
                <DropdownMenuItem>Good</DropdownMenuItem>
                <DropdownMenuItem>Needs Work</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-navy-100 dark:border-navy-800">
        <CardHeader>
          <CardTitle>Speech Recordings</CardTitle>
          <CardDescription>
            {filteredHistory.length} recordings found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredHistory.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Metrics</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((speech) => (
                    <TableRow key={speech.id}>
                      <TableCell className="font-medium">{speech.title}</TableCell>
                      <TableCell>{speech.date}</TableCell>
                      <TableCell>{speech.duration}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={speech.type === "Uploaded" ? "text-blue-600" : "text-green-600"}>
                          {speech.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Badge className={getRatingBadgeColor(speech.rating)}>
                            {speech.rating}
                          </Badge>
                          {speech.clarity && (
                            <Badge className={getMetricBadgeColor(speech.clarity)} variant="outline">
                              {speech.clarity}% clarity
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" title="Play">
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Download">
                            <Download className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => viewSpeechDetails(speech)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>View Analysis</DropdownMenuItem>
                              <DropdownMenuItem>Compare</DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => deleteSpeechRecord(speech.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <p>No speech recordings found.</p>
              <p className="mt-2">Start recording on the Analysis page to see your history here.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredHistory.length} of {speechHistory.length} recordings
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={filteredHistory.length === 0}>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Speech Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl">
          {selectedSpeech && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedSpeech.title}</DialogTitle>
                <DialogDescription>
                  {selectedSpeech.date} • {selectedSpeech.duration} • {selectedSpeech.type}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Overall Rating</span>
                          <Badge className={getRatingBadgeColor(selectedSpeech.rating)}>
                            {selectedSpeech.rating}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Speech Pace</span>
                          <span className="text-sm">{selectedSpeech.pace} wpm</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {selectedSpeech.pace < 100 ? "Too slow" : 
                             selectedSpeech.pace > 180 ? "Too fast" : 
                             "Ideal pace"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Clarity</span>
                          <span className="text-sm">{selectedSpeech.clarity}%</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Filler Words</span>
                          <span className="text-sm">{selectedSpeech.fillerCount} detected</span>
                        </div>
                        {selectedSpeech.fillerWords && selectedSpeech.fillerWords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedSpeech.fillerWords.map((word, index) => (
                              <Badge key={index} variant="outline">{word}</Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {selectedSpeech.tone && (
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Tone & Confidence</span>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary">{selectedSpeech.tone}</Badge>
                            {selectedSpeech.confidence && (
                              <Badge 
                                className={getMetricBadgeColor(selectedSpeech.confidence)}
                                variant="outline"
                              >
                                {selectedSpeech.confidence}% confidence
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Transcript</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-4 max-h-60 overflow-y-auto">
                      {selectedSpeech.transcript ? (
                        <p className="text-sm">{selectedSpeech.transcript}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-6">No transcript available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setDetailsOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    // In a real app, would download the recording
                    toast({
                      title: "Download not available",
                      description: "This feature is not implemented in the demo."
                    });
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Recording
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HistoryPage;
