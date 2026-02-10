import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Mail,
  Zap,
  Cloud,
  Shield,
  Users,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Github
} from 'lucide-react';

const HomePage = ({ onGetStarted }) => {
  const features = [
    {
      icon: <Mail className="w-8 h-8 text-primary" />,
      title: "Email Campaign Editor",
      description: "Create and manage multiple email campaigns with A/B/C variant testing capabilities"
    },
    {
      icon: <Cloud className="w-8 h-8 text-primary" />,
      title: "Cloud Sync",
      description: "Seamlessly sync your campaigns to GitHub Gist with automatic backup and version control"
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Real-time Preview",
      description: "See your email changes instantly with live preview and responsive design testing"
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Secure & Private",
      description: "Your data stays private with client-side storage and encrypted cloud backup"
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Team Collaboration",
      description: "Share campaigns with your team through GitHub Gist integration"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: "Variant Testing",
      description: "Create up to 3 variants per campaign to optimize your messaging"
    }
  ];

  const benefits = [
    "No installation required - works in your browser",
    "Auto-save to prevent data loss",
    "Export campaigns as JSON for easy backup",
    "Mobile-responsive email templates",
    "GitHub Pages deployment ready"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">Nook Email Campaign</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">v1.0</Badge>
              <Button variant="ghost" size="sm" asChild>
                <a href="https://github.com/juandel-12/nook-email-campaign" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="w-3 h-3 mr-1" />
            Now with Cloud Sync
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Create Beautiful Email Campaigns
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            A modern, lightweight email campaign editor with cloud sync, variant testing,
            and real-time preview. Perfect for marketing teams of 2-5 people.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" onClick={onGetStarted} className="text-lg px-8 group">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <a href="https://github.com/juandel-12/nook-email-campaign#readme" target="_blank" rel="noopener noreferrer">
                View Documentation
              </a>
            </Button>
          </div>

          {/* Quick Benefits */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              No signup required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Free & open source
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Works offline
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20 bg-background/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to manage campaigns
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed for modern marketing teams
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-2xl md:text-3xl">
                Why Choose Nook Email Campaign?
              </CardTitle>
              <CardDescription className="text-base">
                Built with modern web technologies and best practices
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-base">{benefit}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to create your first campaign?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start creating beautiful email campaigns in seconds
          </p>
          <Button size="lg" onClick={onGetStarted} className="text-lg px-12 group">
            Launch Editor
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>© 2026 Nook Email Campaign. Open source project.</span>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" asChild>
                <a href="https://github.com/juandel-12/nook-email-campaign" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="https://github.com/juandel-12/nook-email-campaign#readme" target="_blank" rel="noopener noreferrer">
                  Documentation
                </a>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
