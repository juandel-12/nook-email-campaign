import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Plus, X } from 'lucide-react';
import { useCampaignContext } from '../contexts/CampaignContext';

const VariantTabs = () => {
  const {
    campaignsData,
    currentCampaignId,
    currentEmailIndex,
    currentVariant,
    setCurrentVariant,
    addVariant,
    deleteVariant,
  } = useCampaignContext();

  const [isAdding, setIsAdding] = useState(false);
  const [newVariantName, setNewVariantName] = useState('');

  const campaign = campaignsData.campaigns.find(c => c.id === currentCampaignId);
  const email = campaign?.emails[currentEmailIndex];
  const variantKeys = email ? Object.keys(email.variants) : [];

  const handleAddVariant = () => {
    const sanitized = newVariantName.trim().toLowerCase().replace(/\s+/g, '-');
    if (!sanitized) return;
    if (variantKeys.includes(sanitized)) {
      alert('A variant with that name already exists.');
      return;
    }
    addVariant(currentCampaignId, sanitized);
    setNewVariantName('');
    setIsAdding(false);
  };

  const handleDeleteVariant = (e, key) => {
    e.stopPropagation();
    if (variantKeys.length <= 1) {
      alert('Cannot delete the last variant.');
      return;
    }
    if (window.confirm(`Delete variant "${key}"? This will remove it from all emails in this campaign.`)) {
      deleteVariant(currentCampaignId, key);
    }
  };

  const handleAddKeyDown = (e) => {
    if (e.key === 'Enter') handleAddVariant();
    if (e.key === 'Escape') {
      setIsAdding(false);
      setNewVariantName('');
    }
  };

  if (!email) return null;

  return (
    <div className="mb-4">
      <Tabs value={currentVariant} onValueChange={setCurrentVariant}>
        <div className="flex items-center gap-2">
          <TabsList>
            {variantKeys.map((key) => (
              <TabsTrigger key={key} value={key} className="relative group gap-1">
                {key.charAt(0).toUpperCase() + key.slice(1)}
                {variantKeys.length > 1 && (
                  <button
                    onClick={(e) => handleDeleteVariant(e, key)}
                    className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-destructive/20 p-0.5"
                    title={`Delete ${key} variant`}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {isAdding ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={newVariantName}
                onChange={(e) => setNewVariantName(e.target.value)}
                onKeyDown={handleAddKeyDown}
                onBlur={() => { if (!newVariantName.trim()) setIsAdding(false); }}
                autoFocus
                placeholder="Variant name"
                className="h-7 w-32 text-sm px-2 rounded-md border border-input bg-background"
              />
              <Button size="sm" variant="ghost" className="h-7 px-2" onClick={handleAddVariant}>
                Add
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={() => setIsAdding(true)}
              title="Add variant"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default VariantTabs;
