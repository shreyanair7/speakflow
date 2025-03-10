
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";

const AnalyticsPage = () => {
  // Sample data for charts
  const lineChartData = [
    {
      name: "Week 1",
      fillerWords: 45,
      clarity: 60,
      pace: 50,
    },
    {
      name: "Week 2",
      fillerWords: 38,
      clarity: 65,
      pace: 55,
    },
    {
      name: "Week 3",
      fillerWords: 32,
      clarity: 70,
      pace: 65,
    },
    {
      name: "Week 4",
      fillerWords: 28,
      clarity: 75,
      pace: 70,
    },
    {
      name: "Week 5",
      fillerWords: 22,
      clarity: 78,
      pace: 72,
    },
    {
      name: "Week 6",
      fillerWords: 15,
      clarity: 82,
      pace: 78,
    },
  ];

  const barChartData = [
    {
      name: "Um",
      count: 32,
    },
    {
      name: "Uh",
      count: 25,
    },
    {
      name: "Like",
      count: 18,
    },
    {
      name: "Actually",
      count: 15,
    },
    {
      name: "You know",
      count: 12,
    },
    {
      name: "So",
      count: 10,
    },
  ];

  const pieChartData = [
    { name: "Excellent", value: 35 },
    { name: "Good", value: 45 },
    { name: "Needs Improvement", value: 20 },
  ];

  const areaChartData = [
    { name: "Mon", pacing: 50, clarity: 55, engagement: 60 },
    { name: "Tue", pacing: 55, clarity: 60, engagement: 65 },
    { name: "Wed", pacing: 60, clarity: 65, engagement: 70 },
    { name: "Thu", pacing: 65, clarity: 68, engagement: 72 },
    { name: "Fri", pacing: 70, clarity: 72, engagement: 75 },
    { name: "Sat", pacing: 75, clarity: 76, engagement: 78 },
    { name: "Sun", pacing: 78, clarity: 80, engagement: 82 },
  ];

  const feedbackItems = [
    {
      type: "positive",
      text: "Your speech pace has significantly improved over the past month.",
    },
    {
      type: "suggestion",
      text: "Try to incorporate more pauses for emphasis in your key points.",
    },
    {
      type: "positive",
      text: "Great progress in reducing filler words, especially 'um' and 'uh'.",
    },
    {
      type: "suggestion",
      text: "Your tone variation could use more work. Try practicing with greater vocal dynamics.",
    },
    {
      type: "positive",
      text: "Your clarity and enunciation are consistently improving.",
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics & Insights</h1>
        <p className="text-muted-foreground">
          Track your progress and get personalized AI recommendations
        </p>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          <TabsTrigger value="filler-words">Filler Words</TabsTrigger>
          <TabsTrigger value="feedback">AI Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="border-2 border-navy-100 dark:border-navy-800">
              <CardHeader>
                <CardTitle>Speaking Progress</CardTitle>
                <CardDescription>
                  Your skill development over the last 6 weeks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart 
                  data={lineChartData}
                  categories={["clarity", "pace", "fillerWords"]}
                  index="name"
                  colors={["green", "blue", "red"]}
                  valueFormatter={(value) => `${value}%`}
                  className="h-72"
                />
              </CardContent>
            </Card>
            
            <Card className="border-2 border-navy-100 dark:border-navy-800">
              <CardHeader>
                <CardTitle>Weekly Performance</CardTitle>
                <CardDescription>
                  This week's speaking metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AreaChart 
                  data={areaChartData}
                  categories={["pacing", "clarity", "engagement"]}
                  index="name"
                  colors={["blue", "green", "purple"]}
                  valueFormatter={(value) => `${value}%`}
                  className="h-72"
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-navy-100 dark:border-navy-800">
              <CardHeader>
                <CardTitle>Recent Performance</CardTitle>
                <CardDescription>
                  Analysis of your recent speech recordings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart 
                  data={pieChartData}
                  index="name"
                  category="value"
                  valueFormatter={(value) => `${value}%`}
                  className="h-72"
                  colors={["green", "blue", "orange"]}
                />
              </CardContent>
            </Card>
            
            <Card className="col-span-2 border-2 border-navy-100 dark:border-navy-800">
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>
                  AI-generated feedback on your speaking style
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedbackItems.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Badge 
                        variant={item.type === "positive" ? "default" : "outline"}
                        className={item.type === "positive" ? "bg-green-500" : "text-amber-600 border-amber-600"}
                      >
                        {item.type === "positive" ? "Strength" : "Opportunity"}
                      </Badge>
                      <p className="text-sm">{item.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="progress">
          <div className="grid grid-cols-1 gap-6">
            <Card className="border-2 border-navy-100 dark:border-navy-800">
              <CardHeader>
                <CardTitle>Long-term Progress</CardTitle>
                <CardDescription>
                  Track your improvement over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart 
                  data={lineChartData}
                  categories={["clarity", "pace", "fillerWords"]}
                  index="name"
                  colors={["green", "blue", "red"]}
                  valueFormatter={(value) => `${value}%`}
                  className="h-96"
                />
              </CardContent>
            </Card>
            
            <Card className="border-2 border-navy-100 dark:border-navy-800">
              <CardHeader>
                <CardTitle>Skill Breakdown</CardTitle>
                <CardDescription>
                  Detailed analysis of your speaking skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">Clarity</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pronunciation</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Articulation</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Volume Control</span>
                      <span className="text-sm font-medium">82%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Pacing</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Speed</span>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pauses</span>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rhythm</span>
                      <span className="text-sm font-medium">72%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Engagement</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tone Variation</span>
                      <span className="text-sm font-medium">70%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Emphasis</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Expression</span>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="filler-words">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-navy-100 dark:border-navy-800">
              <CardHeader>
                <CardTitle>Filler Word Usage</CardTitle>
                <CardDescription>
                  Most common filler words in your speeches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={barChartData}
                  index="name"
                  categories={["count"]}
                  colors={["navy"]}
                  valueFormatter={(value) => `${value} times`}
                  className="h-96"
                />
              </CardContent>
            </Card>
            
            <Card className="border-2 border-navy-100 dark:border-navy-800">
              <CardHeader>
                <CardTitle>Filler Word Reduction</CardTitle>
                <CardDescription>
                  Your progress in reducing filler words
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Filler Word Frequency</h3>
                  <LineChart 
                    data={lineChartData}
                    categories={["fillerWords"]}
                    index="name"
                    colors={["red"]}
                    valueFormatter={(value) => `${value} occurrences`}
                    className="h-60"
                  />
                </div>
                
                <div className="bg-navy-50 dark:bg-navy-900 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Tips to Reduce Filler Words</h3>
                  <ul className="text-sm space-y-2">
                    <li>1. Practice pausing instead of using fillers</li>
                    <li>2. Record yourself and identify usage patterns</li>
                    <li>3. Slow down your speaking pace slightly</li>
                    <li>4. Prepare key points before speaking</li>
                    <li>5. Develop awareness by having a friend signal when you use fillers</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="feedback">
          <Card className="border-2 border-navy-100 dark:border-navy-800">
            <CardHeader>
              <CardTitle>AI Coaching Feedback</CardTitle>
              <CardDescription>
                Personalized recommendations to improve your speaking skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                  <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">Strengths</h3>
                  <ul className="text-sm space-y-2 text-green-700 dark:text-green-300">
                    <li>• Your speech clarity has improved significantly (78% increase over 6 weeks)</li>
                    <li>• You've reduced filler words by over 60% since starting</li>
                    <li>• Your pacing has become more consistent and natural</li>
                    <li>• You're using pauses more effectively for emphasis</li>
                  </ul>
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-900 p-4 rounded-lg">
                  <h3 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Areas for Improvement</h3>
                  <ul className="text-sm space-y-2 text-amber-700 dark:text-amber-300">
                    <li>• Try to increase your tone variation to improve engagement</li>
                    <li>• Work on more consistent volume control throughout your speeches</li>
                    <li>• Develop stronger openings and closings in your presentations</li>
                    <li>• Practice proper breathing techniques to support longer sentences</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Personalized Exercises</h3>
                  <div className="space-y-4 text-blue-700 dark:text-blue-300">
                    <div>
                      <h4 className="text-sm font-medium">1. Tone Variation Practice</h4>
                      <p className="text-sm">Read the same paragraph with different emotions: excited, serious, curious, and confident.</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">2. Pause Integration</h4>
                      <p className="text-sm">Mark a script with planned pause locations and practice honoring those pauses.</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">3. Filler Word Awareness</h4>
                      <p className="text-sm">Record a 2-minute impromptu speech on a familiar topic, focusing specifically on eliminating "like" and "um".</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
