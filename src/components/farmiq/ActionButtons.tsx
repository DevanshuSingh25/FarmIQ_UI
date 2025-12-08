import { Card, CardContent } from "@/components/ui/card";
import { SectionSpeaker } from "@/components/ui/section-speaker";
import { useNavigate } from "react-router-dom";
import { Volume2 } from "lucide-react";
import type { FarmerAction } from "@/types/farmer-ui.types";
import { speakText } from "@/utils/farmer-audio";

export function ActionButtons() {
  const navigate = useNavigate();

  // Farmer-friendly actions with emojis and bilingual text
  const actions: FarmerAction[] = [
    {
      id: 'soil',
      emoji: '🌱',
      title: {
        hindi: 'मिट्टी जाँच',
        english: 'Soil Analysis'
      },
      description: {
        hindi: 'मिट्टी की सेहत जांचें',
        english: 'Test soil health'
      },
      color: 'success',
      route: '/soil-analysis',
      audioText: 'मिट्टी जाँच. Soil Analysis. मिट्टी की सेहत जांचें और सुझाव पाएं'
    },
    {
      id: 'disease',
      emoji: '🌾',
      title: {
        hindi: 'फसल रोग',
        english: 'Crop Disease'
      },
      description: {
        hindi: 'रोग पहचानें',
        english: 'Detect diseases'
      },
      color: 'destructive',
      route: '/farmer/crop-disease',
      audioText: 'फसल रोग. Crop Disease. फसल के रोग पहचानें और रोकें'
    },
    {
      id: 'market',
      emoji: '💰',
      title: {
        hindi: 'बाज़ार भाव',
        english: 'Market Prices'
      },
      description: {
        hindi: 'आज की कीमत देखें',
        english: 'Latest prices'
      },
      color: 'primary',
      route: '/market-prices',
      audioText: 'बाज़ार भाव. Market Prices. आज की बाज़ार कीमत और ट्रेंड देखें'
    },
    {
      id: 'ngo',
      emoji: '🏛️',
      title: {
        hindi: 'सरकारी योजना',
        english: 'Gov Schemes'
      },
      description: {
        hindi: 'योजनाएं देखें',
        english: 'View schemes'
      },
      color: 'accent',
      route: '/farmer/ngo-schemes',
      audioText: 'सरकारी योजना. Government Schemes. सरकारी योजनाएं और मदद पाएं'
    },
    {
      id: 'weather',
      emoji: '🌤️',
      title: {
        hindi: 'मौसम',
        english: 'Weather'
      },
      description: {
        hindi: 'मौसम समाचार',
        english: 'Weather updates'
      },
      color: 'info',
      route: '/weather',
      audioText: 'मौसम. Weather. अपने क्षेत्र का मौसम और फसल सलाह देखें'
    }
  ];

  const handleCardClick = (action: FarmerAction) => {
    // Navigate without audio
    navigate(action.route);
  };

  const handleSpeakerClick = (e: React.MouseEvent, action: FarmerAction) => {
    // Prevent card click event
    e.stopPropagation();

    // Play audio only
    if (action.audioText) {
      speakText(action.audioText);
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'success':
        return {
          bg: 'bg-success/10 dark:bg-success/20',
          border: 'border-success/30 dark:border-success/40',
          gradient: 'from-success to-success/80',
          hover: 'hover:border-success hover:shadow-[0_0_20px_rgba(74,222,128,0.3)]'
        };
      case 'destructive':
        return {
          bg: 'bg-destructive/10 dark:bg-destructive/20',
          border: 'border-destructive/30 dark:border-destructive/40',
          gradient: 'from-destructive to-destructive/80',
          hover: 'hover:border-destructive hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]'
        };
      case 'primary':
        return {
          bg: 'bg-primary/10 dark:bg-primary/20',
          border: 'border-primary/30 dark:border-primary/40',
          gradient: 'from-primary to-primary/80',
          hover: 'hover:border-primary hover:shadow-[0_0_20px_rgba(34,139,34,0.3)]'
        };
      case 'accent':
        return {
          bg: 'bg-accent/20 dark:bg-accent/30',
          border: 'border-accent/40 dark:border-accent/50',
          gradient: 'from-accent to-accent/80',
          hover: 'hover:border-accent hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]'
        };
      case 'info':
        return {
          bg: 'bg-blue-500/10 dark:bg-blue-500/20',
          border: 'border-blue-500/30 dark:border-blue-500/40',
          gradient: 'from-blue-500 to-blue-500/80',
          hover: 'hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'
        };
      default:
        return {
          bg: 'bg-muted',
          border: 'border-border',
          gradient: 'from-muted to-muted/80',
          hover: 'hover:border-primary'
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {actions.map((action) => {
        const colorClasses = getColorClasses(action.color);

        return (
          <Card
            key={action.id}
            className={`
              ${colorClasses.bg} ${colorClasses.border} ${colorClasses.hover}
              border-[3px] 
              touch-target-large
              hover:scale-105 
              active:scale-95
              transition-all duration-300 
              cursor-pointer 
              group 
              overflow-hidden
              shadow-medium
            `}
            onClick={() => handleCardClick(action)}
          >
            <CardContent className="p-8 relative">
              {/* Speaker Button - Top Right Corner */}
              <button
                onClick={(e) => handleSpeakerClick(e, action)}
                className={`
                  absolute top-3 right-3 z-10
                  p-3 rounded-full
                  ${action.color === 'destructive' ? 'bg-red-500' : action.color === 'accent' ? 'bg-yellow-500' : action.color === 'primary' ? 'bg-green-600' : action.color === 'info' ? 'bg-blue-500' : 'bg-green-500'}
                  text-white
                  hover:scale-110 active:scale-95
                  transition-transform duration-200
                  shadow-md hover:shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background
                  ${action.color === 'destructive' ? 'focus:ring-red-500' : action.color === 'accent' ? 'focus:ring-yellow-500' : action.color === 'primary' ? 'focus:ring-green-600' : action.color === 'info' ? 'focus:ring-blue-500' : 'focus:ring-green-500'}
                `}
                aria-label={`Listen to ${action.title.english} description`}
              >
                <Volume2 className="h-5 w-5" />
              </button>

              {/* Centered Content */}
              <div className="flex flex-col items-center text-center h-full">

                {/* Emoji Circle */}
                <div className={`
                  mb-6 rounded-full w-24 h-24 flex items-center justify-center shadow-sm
                  ${action.color === 'destructive' ? 'bg-red-500' : action.color === 'accent' ? 'bg-yellow-500' : action.color === 'primary' ? 'bg-green-600' : action.color === 'info' ? 'bg-blue-500' : 'bg-green-500'}
                  text-white
                `}>
                  <span className="text-5xl filter drop-shadow-md">{action.emoji}</span>
                </div>

                {/* Text Content */}
                <h3 className="text-2xl font-bold mb-2 text-foreground">
                  {action.title.english}
                </h3>

                <p className="text-muted-foreground mb-8 text-lg leading-snug px-2">
                  {action.description.english}
                </p>

                {/* 'Get Started' Button */}
                <div className="mt-auto w-full">
                  <div className="bg-background/80 hover:bg-background text-foreground font-bold py-3 px-6 rounded-full shadow-sm flex items-center justify-center gap-2 group-hover:translate-x-1 transition-transform border-2 border-border/10">
                    Get Started <span className="text-lg">›</span>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}