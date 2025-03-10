
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, LineChart } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { AIChatbot } from "@/components/ai-chatbot";

const AnalyticsPage = () => {
  // Sample data for charts - simplified
  const lineChartData = [
    { name: "Week 1", clarity: 60, pace: 50 },
    { name: "Week 2", clarity: 65, pace: 55 },
    { name: "Week 3", clarity: 70, pace: 65 },
    { name: "Week 4", clarity: 75, pace: 70 },
    { name: "Week 5", clarity: 78, pace: 72 },
    { name: "Week 6", clarity: 82, pace: 78 },
  ];

  const areaChartData = [
    { name: "Mon", pacing: 50, clarity: 55 },
    { name: "Tue", pacing: 55, clarity: 60 },
    { name: "Wed", pacing: 60, clarity: 65 },
    { name: "Thu", pacing: 65, clarity: 68 },
    { name: "Fri", pacing: 70, clarity: 72 },
    { name: "Sat", pacing: 75, clarity: 76 },
    { name: "Sun", pacing: 78, clarity: 80 },
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
              categories={["clarity", "pace"]}
              index="name"
              colors={["green", "blue"]}
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
              categories={["pacing", "clarity"]}
              index="name"
              colors={["blue", "green"]}
              valueFormatter={(value) => `${value}%`}
              className="h-72"
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-2 border-navy-100 dark:border-navy-800">
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

        <Card className="border-2 border-navy-100 dark:border-navy-800">
          <CardHeader>
            <CardTitle>AI Speech Coach</CardTitle>
            <CardDescription>
              Ask for suggestions and get personalized improvement tips
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AIChatbot />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
