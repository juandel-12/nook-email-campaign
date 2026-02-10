import React, { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useCampaignContext } from '../contexts/CampaignContext';
import { renderEmailTemplate, renderEmailTemplateRaw } from '../utils/emailTemplate';
import { Copy, Check, Bold, Italic, Link as LinkIcon, Code, Undo, Redo } from 'lucide-react';
import ColorPicker from './ColorPicker';

const VariantForm = ({ campaignId, emailIndex, variant }) => {
  const { campaignsData, config, updateEmail } = useCampaignContext();
  const [renderedHtml, setRenderedHtml] = useState('');
  const [rawHtml, setRawHtml] = useState('');
  const [copied, setCopied] = useState(false);
  const [bodyMode, setBodyMode] = useState('visual'); // 'visual' or 'code'
  const textareaRef = useRef(null);
  const contentEditableRef = useRef(null);
  const lastBodyValueRef = useRef('');
  const iframeRef = useRef(null);
  const lastScrollPosition = useRef({ x: 0, y: 0 });
  const updatePreviewTimeoutRef = useRef(null);

  // History state for undo/redo
  const [history, setHistory] = useState({
    subject: { past: [], present: '', future: [] },
    preview: { past: [], present: '', future: [] },
    body: { past: [], present: '', future: [] }
  });
  const historyTimeoutRef = useRef({});

  const campaign = campaignsData.campaigns.find(c => c.id === campaignId);
  const email = campaign?.emails[emailIndex];
  const variantData = email?.variants[variant] || { subject: '', preview: '', body: '' };

  // Initialize history when variant data loads
  useEffect(() => {
    setHistory({
      subject: { past: [], present: variantData.subject || '', future: [] },
      preview: { past: [], present: variantData.preview || '', future: [] },
      body: { past: [], present: variantData.body || '', future: [] }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId, emailIndex, variant]); // Reset history when switching emails/variants

  // Update rendered HTML with debouncing to prevent flashing
  useEffect(() => {
    if (config.htmlTemplate && email) {
      // Clear any pending updates
      if (updatePreviewTimeoutRef.current) {
        clearTimeout(updatePreviewTimeoutRef.current);
      }

      // Debounce the preview update (300ms)
      updatePreviewTimeoutRef.current = setTimeout(() => {
        // Save current scroll position before update
        if (iframeRef.current?.contentWindow) {
          try {
            const win = iframeRef.current.contentWindow;
            lastScrollPosition.current = {
              x: win.scrollX || win.pageXOffset || 0,
              y: win.scrollY || win.pageYOffset || 0
            };
          } catch (e) {
            // Ignore cross-origin errors
          }
        }

        const html = renderEmailTemplate(config.htmlTemplate, email, variant);
        const raw = renderEmailTemplateRaw(config.htmlTemplate, email, variant);
        setRenderedHtml(html);
        setRawHtml(raw);

        // Restore scroll position after a brief delay for iframe to load
        setTimeout(() => {
          try {
            const win = iframeRef.current?.contentWindow;
            if (win && lastScrollPosition.current) {
              win.scrollTo(lastScrollPosition.current.x, lastScrollPosition.current.y);
            }
          } catch (e) {
            // Ignore cross-origin errors
          }
        }, 100);
      }, 300);

      return () => {
        if (updatePreviewTimeoutRef.current) {
          clearTimeout(updatePreviewTimeoutRef.current);
        }
      };
    }
  }, [email, variant, config.htmlTemplate]);

  // Update contentEditable only when body changes from external source (not from typing)
  useEffect(() => {
    if (bodyMode === 'visual' && contentEditableRef.current) {
      const newBody = variantData.body || '';
      // Only update if the content is different and it's not from user input
      if (contentEditableRef.current.innerHTML !== newBody && lastBodyValueRef.current !== newBody) {
        const sel = window.getSelection();
        const hadFocus = document.activeElement === contentEditableRef.current;
        let cursorPosition = null;

        // Save cursor position if element has focus
        if (hadFocus && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          cursorPosition = {
            startContainer: range.startContainer,
            startOffset: range.startOffset,
            endContainer: range.endContainer,
            endOffset: range.endOffset
          };
        }

        // Update content
        contentEditableRef.current.innerHTML = newBody;
        lastBodyValueRef.current = newBody;

        // Restore cursor position
        if (hadFocus && cursorPosition) {
          setTimeout(() => {
            try {
              const newRange = document.createRange();
              newRange.setStart(cursorPosition.startContainer, cursorPosition.startOffset);
              newRange.setEnd(cursorPosition.endContainer, cursorPosition.endOffset);
              sel.removeAllRanges();
              sel.addRange(newRange);
              contentEditableRef.current?.focus();
            } catch (e) {
              // If cursor position is no longer valid, place at end
              contentEditableRef.current?.focus();
            }
          }, 0);
        }
      }
    }
  }, [variantData.body, bodyMode]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        const activeElement = document.activeElement;
        if (activeElement?.id === 'subject') handleUndo('subject');
        else if (activeElement?.id === 'preview') handleUndo('preview');
        else if (activeElement === contentEditableRef.current || activeElement === textareaRef.current) {
          handleUndo('body');
        }
      }
      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y for redo
      if ((e.ctrlKey || e.metaKey) && ((e.shiftKey && e.key === 'z') || e.key === 'y')) {
        e.preventDefault();
        const activeElement = document.activeElement;
        if (activeElement?.id === 'subject') handleRedo('subject');
        else if (activeElement?.id === 'preview') handleRedo('preview');
        else if (activeElement === contentEditableRef.current || activeElement === textareaRef.current) {
          handleRedo('body');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  // Early return after all hooks
  if (!campaign || !email) return null;

  const handleChange = (field, value) => {
    // Track the last body value to prevent unnecessary updates
    if (field === 'body') {
      lastBodyValueRef.current = value;
    }

    // Update history with debouncing (500ms)
    clearTimeout(historyTimeoutRef.current[field]);
    historyTimeoutRef.current[field] = setTimeout(() => {
      setHistory(prev => {
        const fieldHistory = prev[field];
        // Only add to history if value changed
        if (fieldHistory.present === value) return prev;

        return {
          ...prev,
          [field]: {
            past: [...fieldHistory.past, fieldHistory.present],
            present: value,
            future: [] // Clear future when new change is made
          }
        };
      });
    }, 500);

    updateEmail(campaignId, emailIndex, variant, field, value);
  };

  const handleUndo = (field) => {
    setHistory(prev => {
      const fieldHistory = prev[field];
      if (fieldHistory.past.length === 0) return prev;

      const previous = fieldHistory.past[fieldHistory.past.length - 1];
      const newPast = fieldHistory.past.slice(0, -1);

      // Update the actual field value
      updateEmail(campaignId, emailIndex, variant, field, previous);

      return {
        ...prev,
        [field]: {
          past: newPast,
          present: previous,
          future: [fieldHistory.present, ...fieldHistory.future]
        }
      };
    });
  };

  const handleRedo = (field) => {
    setHistory(prev => {
      const fieldHistory = prev[field];
      if (fieldHistory.future.length === 0) return prev;

      const next = fieldHistory.future[0];
      const newFuture = fieldHistory.future.slice(1);

      // Update the actual field value
      updateEmail(campaignId, emailIndex, variant, field, next);

      return {
        ...prev,
        [field]: {
          past: [...fieldHistory.past, fieldHistory.present],
          present: next,
          future: newFuture
        }
      };
    });
  };

  const handleCopyHtml = async () => {
    try {
      // Copy the raw unsanitized HTML
      await navigator.clipboard.writeText(rawHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy HTML:', error);
    }
  };

  // Text formatting helpers
  const insertFormatting = (prefix, suffix = '') => {
    if (bodyMode === 'visual') {
      // For visual mode, just wrap selection with tags
      // This allows proper nesting of formatting
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const selectedContent = range.extractContents();

      // Create wrapper elements
      const wrapper = document.createElement('span');
      wrapper.innerHTML = prefix;
      const openTag = wrapper.firstChild || wrapper;

      openTag.appendChild(selectedContent);
      range.insertNode(openTag);

      // Update the body content
      const contentDiv = contentEditableRef.current;
      if (contentDiv) {
        handleChange('body', contentDiv.innerHTML);
      }
    } else {
      // Use textarea selection for code mode
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = variantData.body.substring(start, end);
      const beforeText = variantData.body.substring(0, start);
      const afterText = variantData.body.substring(end);

      const newText = beforeText + prefix + selectedText + suffix + afterText;
      handleChange('body', newText);

      // Set cursor position after the inserted formatting
      setTimeout(() => {
        const newCursorPos = start + prefix.length + selectedText.length + suffix.length;
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  const handleBold = () => {
    if (bodyMode === 'visual') {
      document.execCommand('bold', false, null);
      const contentDiv = contentEditableRef.current;
      if (contentDiv) {
        handleChange('body', contentDiv.innerHTML);
      }
    } else {
      insertFormatting('<strong>', '</strong>');
    }
  };

  const handleItalic = () => {
    if (bodyMode === 'visual') {
      document.execCommand('italic', false, null);
      const contentDiv = contentEditableRef.current;
      if (contentDiv) {
        handleChange('body', contentDiv.innerHTML);
      }
    } else {
      insertFormatting('<em>', '</em>');
    }
  };

  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      if (bodyMode === 'visual') {
        document.execCommand('createLink', false, url);
        const contentDiv = contentEditableRef.current;
        if (contentDiv) {
          handleChange('body', contentDiv.innerHTML);
        }
      } else {
        insertFormatting(`<a href="${url}">`, '</a>');
      }
    }
  };

  const handleColor = (color) => {
    if (bodyMode === 'visual') {
      document.execCommand('foreColor', false, color);
      const contentDiv = contentEditableRef.current;
      if (contentDiv) {
        handleChange('body', contentDiv.innerHTML);
      }
    } else {
      insertFormatting(`<span style="color: ${color};">`, '</span>');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left column: Form fields */}
      <div className="space-y-6">
        <div className="grid w-full gap-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="subject">Subject Line</Label>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleUndo('subject')}
                title="Undo (Ctrl+Z)"
                disabled={history.subject.past.length === 0}
                className="h-7 w-7 p-0"
              >
                <Undo className="w-3 h-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRedo('subject')}
                title="Redo (Ctrl+Shift+Z)"
                disabled={history.subject.future.length === 0}
                className="h-7 w-7 p-0"
              >
                <Redo className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <Input
            id="subject"
            value={variantData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            placeholder="Email subject line"
          />
          <p className="text-sm text-muted-foreground">
            This appears in the inbox as the email subject
          </p>
        </div>

        <div className="grid w-full gap-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="preview">Preview Text</Label>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleUndo('preview')}
                title="Undo (Ctrl+Z)"
                disabled={history.preview.past.length === 0}
                className="h-7 w-7 p-0"
              >
                <Undo className="w-3 h-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRedo('preview')}
                title="Redo (Ctrl+Shift+Z)"
                disabled={history.preview.future.length === 0}
                className="h-7 w-7 p-0"
              >
                <Redo className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <Input
            id="preview"
            value={variantData.preview}
            onChange={(e) => handleChange('preview', e.target.value)}
            placeholder="Inbox preview text"
          />
          <p className="text-sm text-muted-foreground">
            Text shown next to the subject in the inbox
          </p>
        </div>

        <div className="grid w-full gap-3">
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="body">Email Body</Label>
            <div className="flex gap-1">
              <Button
                type="button"
                variant={bodyMode === 'visual' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setBodyMode('visual')}
              >
                Visual
              </Button>
              <Button
                type="button"
                variant={bodyMode === 'code' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setBodyMode('code')}
              >
                Code
              </Button>
            </div>
          </div>
          <div className="flex gap-1 mb-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleUndo('body')}
              title="Undo (Ctrl+Z)"
              disabled={history.body.past.length === 0}
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleRedo('body')}
              title="Redo (Ctrl+Shift+Z)"
              disabled={history.body.future.length === 0}
            >
              <Redo className="w-4 h-4" />
            </Button>
            <Separator orientation="vertical" className="h-8" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBold}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleItalic}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLink}
              title="Insert Link"
            >
              <LinkIcon className="w-4 h-4" />
            </Button>
            <ColorPicker onSelectColor={handleColor} />
            <Separator orientation="vertical" className="h-8" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('<br>')}
              title="Line Break"
            >
              <Code className="w-4 h-4" />
            </Button>
          </div>

          {bodyMode === 'code' ? (
            <Textarea
              ref={textareaRef}
              id="body"
              value={variantData.body}
              onChange={(e) => handleChange('body', e.target.value)}
              placeholder="Email content goes here..."
              className="min-h-[400px] font-mono"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '1.5' }}
            />
          ) : (
            <div
              ref={contentEditableRef}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => handleChange('body', e.currentTarget.innerHTML)}
              className="min-h-[400px] p-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-auto"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '1.5' }}
            />
          )}

          <p className="text-sm text-muted-foreground">
            {bodyMode === 'visual'
              ? 'Use the formatting buttons above or type/paste formatted text. Variables like %FIRSTNAME% will be replaced.'
              : 'Use HTML tags for formatting. Variables like %FIRSTNAME% will be replaced.'
            }
          </p>
        </div>
      </div>

      {/* Right column: Live preview with tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Email Output</Label>
          <Button
            onClick={handleCopyHtml}
            variant="outline"
            size="sm"
            disabled={copied}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1" />
                Copy HTML
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
            <TabsTrigger value="code" className="flex-1">Code</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-3">
            <div className="bg-muted rounded-lg overflow-hidden border border-border" style={{ height: 'calc(100vh - 380px)', minHeight: '500px' }}>
              <iframe
                ref={iframeRef}
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
            <p className="text-xs text-muted-foreground mt-2">
              Preview updates automatically as you type. Template variables like %FIRSTNAME% are replaced with placeholder values.
            </p>
          </TabsContent>

          <TabsContent value="code" className="mt-3">
            <div className="bg-muted rounded-lg overflow-hidden border border-border" style={{ height: 'calc(100vh - 380px)', minHeight: '500px' }}>
              <pre className="w-full h-full overflow-auto p-4 text-xs font-mono leading-relaxed">
                <code className="whitespace-pre-wrap break-all">{rawHtml}</code>
              </pre>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Complete HTML code ready to copy into your email service provider. ({rawHtml.length.toLocaleString()} characters)
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VariantForm;
