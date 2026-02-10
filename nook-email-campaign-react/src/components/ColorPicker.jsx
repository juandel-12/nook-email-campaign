import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Palette, Plus, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

const STORAGE_KEY = 'nookSavedColors';

const DEFAULT_COLORS = [
  '#000000', // Black
  '#1665d8', // Blue
  '#dc2626', // Red
  '#16a34a', // Green
  '#ea580c', // Orange
  '#9333ea', // Purple
  '#0891b2', // Cyan
  '#ca8a04', // Yellow
];

const ColorPicker = ({ onSelectColor }) => {
  const [savedColors, setSavedColors] = useState([]);
  const [customColor, setCustomColor] = useState('#1665d8');
  const [open, setOpen] = useState(false);

  // Load saved colors from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedColors(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading saved colors:', error);
    }
  }, []);

  // Save colors to localStorage
  const saveColorsToStorage = (colors) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
    } catch (error) {
      console.error('Error saving colors:', error);
    }
  };

  const handleSelectColor = (color) => {
    onSelectColor(color);
    setOpen(false);
  };

  const handleAddCustomColor = () => {
    if (customColor && !savedColors.includes(customColor)) {
      const newColors = [...savedColors, customColor];
      setSavedColors(newColors);
      saveColorsToStorage(newColors);
    }
  };

  const handleRemoveColor = (colorToRemove) => {
    const newColors = savedColors.filter(c => c !== colorToRemove);
    setSavedColors(newColors);
    saveColorsToStorage(newColors);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          title="Text Color"
        >
          <Palette className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-3">
          {/* Default Colors */}
          <div>
            <div className="text-xs font-medium mb-2 text-muted-foreground">Default Colors</div>
            <div className="grid grid-cols-8 gap-1">
              {DEFAULT_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleSelectColor(color)}
                  className="w-7 h-7 rounded border border-border hover:ring-2 hover:ring-ring transition-all"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Saved Colors */}
          {savedColors.length > 0 && (
            <div>
              <div className="text-xs font-medium mb-2 text-muted-foreground">Saved Colors</div>
              <div className="grid grid-cols-8 gap-1">
                {savedColors.map((color) => (
                  <div key={color} className="relative group">
                    <button
                      onClick={() => handleSelectColor(color)}
                      className="w-7 h-7 rounded border border-border hover:ring-2 hover:ring-ring transition-all"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveColor(color);
                      }}
                      className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      title="Remove color"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Color Input */}
          <div>
            <div className="text-xs font-medium mb-2 text-muted-foreground">Custom Color</div>
            <div className="flex gap-2">
              <div className="flex-1 flex gap-2 items-center">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-10 h-8 rounded border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  placeholder="#1665d8"
                  className="flex-1 h-8 px-2 text-xs rounded-md border border-input bg-background"
                />
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddCustomColor}
                className="h-8 px-2"
                title="Save color"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <Button
              type="button"
              size="sm"
              variant="default"
              onClick={() => handleSelectColor(customColor)}
              className="w-full mt-2"
            >
              Apply Color
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
