import React, { useState, useEffect } from 'react';
import { Heart, BookOpen, TrendingUp, PenTool, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import JournalCalendar from './JournalCalendar';
import { getTodayEntry, saveEntry, getJournalData, type JournalEntry } from '@/lib/storage';

const Dashboard: React.FC = () => {
  const [todayMood, setTodayMood] = useState(3);
  const [todaySymptoms, setTodaySymptoms] = useState(2);
  const [notes, setNotes] = useState('');
  const [savedToday, setSavedToday] = useState(false);
  const [streak, setStreak] = useState(0);

  const moodEmojis = ['😰', '😕', '😐', '😊', '😍'];
  const moodLabels = ['Struggling', 'Not Great', 'Okay', 'Good', 'Amazing'];
  const symptomLevels = ['None', 'Mild', 'Moderate', 'Severe', 'Very Severe'];

  useEffect(() => {
    // Load today's entry and streak data
    const todayEntry = getTodayEntry();
    const journalData = getJournalData();
    
    if (todayEntry) {
      setTodayMood(todayEntry.mood);
      setTodaySymptoms(todayEntry.symptoms);
      setNotes(todayEntry.notes || '');
      setSavedToday(true);
    }
    
    setStreak(journalData.streak);
  }, []);

  const handleSaveEntry = () => {
    const entry: JournalEntry = {
      date: new Date().toISOString().split('T')[0],
      mood: todayMood,
      symptoms: todaySymptoms,
      notes: notes.trim() || undefined
    };

    saveEntry(entry);
    setSavedToday(true);
    
    // Update streak
    const updatedData = getJournalData();
    setStreak(updatedData.streak);
    
    toast.success("Today's entry saved! ✨", {
      description: "Your thoughts have been preserved"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-rose-50/20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Journal Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="h-8 w-8 text-amber-600 mr-3" />
            <h1 className="text-6xl font-serif text-slate-800 tracking-tight">
              Wellness Journal
            </h1>
            <PenTool className="h-6 w-6 text-amber-600 ml-3" />
          </div>
          <p className="text-slate-600 text-xl font-lora italic">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <Badge variant="outline" className="bg-white/80 border-amber-200 text-amber-800 font-crimson px-4 py-2">
              <Star className="h-4 w-4 mr-1" />
              {streak} day streak
            </Badge>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Daily Entry */}
          <Card className="lg:col-span-2 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-8 border-b border-stone-100">
              <CardTitle className="flex items-center gap-3 text-slate-700 text-2xl font-serif">
                <Heart className="h-6 w-6 text-rose-400" />
                Today's Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-10 px-8 py-8">
              
              {/* Mood Section */}
              <div className="space-y-6">
                <div className="border-l-4 border-rose-200 pl-6">
                  <h3 className="text-lg font-serif text-slate-700 mb-2">How are you feeling today?</h3>
                  <p className="text-slate-500 font-crimson italic">Your emotions matter and deserve to be acknowledged</p>
                </div>
                <div className="flex gap-4 justify-center">
                  {moodEmojis.map((emoji, index) => (
                    <Button
                      key={index}
                      variant={todayMood === index ? "default" : "outline"}
                      size="lg"
                      onClick={() => setTodayMood(index)}
                      className={`text-3xl h-20 w-20 rounded-2xl border-2 transition-all duration-300 ${
                        todayMood === index 
                          ? 'bg-slate-800 text-white border-slate-800 shadow-lg scale-105' 
                          : 'bg-white/80 border-stone-200 hover:border-stone-300 hover:shadow-md hover:scale-105 hover:bg-white'
                      }`}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
                <p className="text-center text-slate-600 font-crimson italic">
                  Currently feeling: <span className="font-medium">{moodLabels[todayMood]}</span>
                </p>
              </div>

              {/* Symptoms Section */}
              <div className="space-y-6">
                <div className="border-l-4 border-amber-200 pl-6">
                  <h3 className="text-lg font-serif text-slate-700 mb-2">Symptom severity today?</h3>
                  <p className="text-slate-500 font-crimson italic">Tracking helps us understand patterns</p>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {symptomLevels.map((level, index) => (
                    <Button
                      key={index}
                      variant={todaySymptoms === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTodaySymptoms(index)}
                      className={`transition-all duration-300 rounded-xl px-6 py-3 font-crimson hover:scale-105 ${
                        todaySymptoms === index 
                          ? 'bg-slate-800 text-white shadow-md' 
                          : 'bg-white/80 border-stone-200 hover:border-stone-300 text-slate-600 hover:shadow-md hover:bg-white'
                      }`}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Notes Section */}
              <div className="space-y-6">
                <div className="border-l-4 border-blue-200 pl-6">
                  <h3 className="text-lg font-serif text-slate-700 mb-2">Today's reflections</h3>
                  <p className="text-slate-500 font-crimson italic">What's on your mind? How was your day?</p>
                </div>
                <Textarea
                  placeholder="Dear journal, today I felt..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px] bg-white/80 border-stone-200 focus:border-stone-400 font-lora text-slate-700 leading-relaxed resize-none"
                />
              </div>

              <Button 
                onClick={handleSaveEntry}
                disabled={savedToday}
                className={`w-full font-serif py-6 rounded-2xl shadow-lg text-lg transition-all duration-300 hover:scale-[1.02] ${
                  savedToday 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                    : 'bg-slate-800 hover:bg-slate-900 text-white hover:shadow-xl'
                }`}
              >
                {savedToday ? (
                  <>
                    ✨ Entry Saved for Today
                  </>
                ) : (
                  'Save Today\'s Entry'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Calendar */}
            <JournalCalendar />

            {/* Weekly Reflection */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">🌸</div>
                <p className="text-sm font-serif font-medium text-slate-700 mb-3">Daily Affirmation</p>
                <p className="text-sm text-slate-600 leading-relaxed font-lora italic">
                  "You are resilient, you are brave, and you are taking care of yourself with such grace."
                </p>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-lg bg-white/90">
              <CardHeader>
                <CardTitle className="text-lg font-serif flex items-center gap-2 text-slate-700">
                  <TrendingUp className="h-5 w-5 text-slate-400" />
                  This Week's Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-crimson">Good days</span>
                    <Badge className="bg-emerald-100 text-emerald-700 border-0 font-crimson">5</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-crimson">Challenging days</span>
                    <Badge className="bg-amber-100 text-amber-700 border-0 font-crimson">2</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-crimson">Entries written</span>
                    <Badge className="bg-blue-100 text-blue-700 border-0 font-crimson">{streak}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
