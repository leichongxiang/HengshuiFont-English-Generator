'use client';

import { useState, useEffect } from 'react';
import { Download, BookOpen, GraduationCap, Sparkles, Star, Zap, Target, Heart, ArrowRight, Play, Pause } from 'lucide-react';

export default function DemoPage() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const features = [
    {
      title: "Comprehensive Vocabulary Database",
      subtitle: "500+ 词汇数据库",
      description: "Covering Primary 1-6 and Junior High 7-9 with phonetics and translations",
      icon: BookOpen,
      color: "from-blue-500 to-purple-600",
      demo: "vocabulary-demo"
    },
    {
      title: "Professional Hengshui Grids",
      subtitle: "专业衡水体格子",
      description: "Standard 4-line writing system with customizable settings",
      icon: GraduationCap,
      color: "from-green-500 to-teal-600",
      demo: "grid-demo"
    },
    {
      title: "Scientific Learning Methods",
      subtitle: "科学学习方法",
      description: "Ebbinghaus forgetting curve and spaced repetition system",
      icon: Target,
      color: "from-orange-500 to-red-600",
      demo: "learning-demo"
    },
    {
      title: "Beautiful Modern UI",
      subtitle: "精美现代界面",
      description: "Glassmorphism design with smooth animations",
      icon: Sparkles,
      color: "from-pink-500 to-violet-600",
      demo: "ui-demo"
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, features.length]);

  const currentFeatureData = features[currentFeature];
  const IconComponent = currentFeatureData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Live Demo Experience</span>
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                HengshuiFont
              </span>
              <br />
              <span className="text-4xl md:text-5xl">English Generator</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Experience the most professional English vocabulary practice template generator
              <br />
              <span className="text-lg text-gray-400">体验最专业的英语单词练字模板生成器</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <span className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Try Live Demo
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 border border-white/20">
                <span className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Free
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Feature Showcase */}
      <div className="py-20 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Interactive Feature Demo
            </h2>
            <p className="text-xl text-gray-300">
              Explore our powerful features in real-time
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Feature Navigation */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <span className="text-gray-300">
                  {isPlaying ? 'Auto-playing demo' : 'Demo paused'}
                </span>
              </div>

              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-500 ${
                    index === currentFeature
                      ? 'bg-gradient-to-r ' + feature.color + ' shadow-2xl scale-105'
                      : 'bg-white/5 backdrop-blur-sm hover:bg-white/10'
                  }`}
                  onClick={() => setCurrentFeature(index)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      index === currentFeature ? 'bg-white/20' : 'bg-white/10'
                    }`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                      <p className="text-sm text-gray-300">{feature.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-gray-200 mt-3">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Feature Demo Area */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className={`bg-gradient-to-br ${currentFeatureData.color} rounded-2xl p-8 text-white`}>
                  <div className="flex items-center gap-4 mb-6">
                    <IconComponent className="w-12 h-12" />
                    <div>
                      <h3 className="text-2xl font-bold">{currentFeatureData.title}</h3>
                      <p className="text-white/80">{currentFeatureData.subtitle}</p>
                    </div>
                  </div>
                  
                  {/* Demo Content Based on Feature */}
                  <div className="bg-white/20 rounded-xl p-6">
                    {currentFeatureData.demo === 'vocabulary-demo' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">apple</span>
                          <span className="text-sm">/ˈæpəl/</span>
                        </div>
                        <div className="text-sm">n. 苹果</div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div className="bg-white rounded-full h-2 w-3/4 animate-pulse"></div>
                        </div>
                      </div>
                    )}
                    
                    {currentFeatureData.demo === 'grid-demo' && (
                      <div className="space-y-2">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="border-b border-white/30 h-4"></div>
                        ))}
                        <div className="text-sm mt-4">Standard 4-line Hengshui grid system</div>
                      </div>
                    )}
                    
                    {currentFeatureData.demo === 'learning-demo' && (
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span>Review Schedule</span>
                          <span>Next: 2 hours</span>
                        </div>
                        <div className="space-y-2">
                          {['Day 1', 'Day 3', 'Day 7', 'Day 15'].map((day, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-white rounded-full"></div>
                              <span className="text-sm">{day}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {currentFeatureData.demo === 'ui-demo' && (
                      <div className="space-y-4">
                        <div className="bg-white/20 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          </div>
                          <div className="space-y-2">
                            <div className="bg-white/20 rounded h-2 w-full"></div>
                            <div className="bg-white/20 rounded h-2 w-3/4"></div>
                            <div className="bg-white/20 rounded h-2 w-1/2"></div>
                          </div>
                        </div>
                        <div className="text-sm">Beautiful glassmorphism design</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-20 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Vocabulary Words", sublabel: "词汇单词" },
              { number: "9", label: "Grade Levels", sublabel: "年级覆盖" },
              { number: "100%", label: "Free & Open Source", sublabel: "免费开源" },
              { number: "∞", label: "Unlimited Usage", sublabel: "无限使用" }
            ].map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-gray-200">{stat.label}</div>
                <div className="text-sm text-gray-400">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-black/30">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students already using HengshuiFont English Generator
            <br />
            <span className="text-gray-400">加入已经在使用衡水体英语生成器的数千名学生</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              <span className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Start Free Now
              </span>
            </button>
            
            <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 border border-white/20">
              <span className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Star on GitHub
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
