import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { renderEmailTemplate, getEmailSubject, getEmailPreview } from '../utils/emailTemplate';
import { Copy, Check } from 'lucide-react';

const EmailPreviewModal = ({ isOpen, onClose, emailData, variant, template }) => {
  const [renderedHtml, setRenderedHtml] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && emailData && template) {
      const html = renderEmailTemplate(template, emailData, variant);
      setRenderedHtml(html);
    }
  }, [isOpen, emailData, variant, template]);

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(renderedHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy HTML:', error);
    }
  };

  if (!emailData) {
    return null;
  }

  const subject = getEmailSubject(emailData, variant);
  const preview = getEmailPreview(emailData, variant);

  const variantLabels = {
    flooring: 'Flooring',
    lighting: 'Lighting',
    generic: 'Generic'
  };

  const variantColors = {
    flooring: 'bg-blue-500',
    lighting: 'bg-amber-500',
    generic: 'bg-green-500'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Email Preview" width="max-w-[1000px]">
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(90vh-120px)]">
        {/* Left panel: Email preview iframe */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="bg-muted rounded-lg overflow-hidden flex-1 border border-border">
            <iframe
              srcDoc={renderedHtml}
              title="Email Preview"
              className="w-full h-full"
              sandbox="allow-same-origin"
              style={{
                backgroundColor: '#263238',
                border: 'none'
              }}
            />
          </div>
        </div>

        {/* Right panel: Metadata */}
        <div className="lg:w-80 flex flex-col gap-4">
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Variant</div>
              <Badge className={`${variantColors[variant]} text-white`}>
                {variantLabels[variant]}
              </Badge>
            </div>

            <Separator />

            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2">Day</div>
              <div className="text-sm">Day {emailData.day}</div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2">Title</div>
              <div className="text-sm">{emailData.title}</div>
            </div>

            <Separator />

            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2">Subject</div>
              <div className="text-sm break-words">{subject || <span className="text-muted-foreground italic">No subject</span>}</div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2">Preview Text</div>
              <div className="text-sm break-words">{preview || <span className="text-muted-foreground italic">No preview text</span>}</div>
            </div>

            <Separator />

            <Button
              onClick={handleCopyHtml}
              variant="outline"
              className="w-full"
              disabled={copied}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy HTML
                </>
              )}
            </Button>
          </div>

          <div className="mt-auto pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground">
              <p className="mb-2">This preview shows how your email will appear to recipients.</p>
              <p>Template variables like %FIRSTNAME% and %%VIDEO_URL%% are replaced with placeholder values.</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EmailPreviewModal;
