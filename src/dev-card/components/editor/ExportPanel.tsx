import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Download, Image, FileCode, Share2, Twitter, Linkedin, Copy, Check, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { toPng, toSvg } from 'html-to-image';

interface ExportPanelProps {
  cardRef: React.RefObject<HTMLDivElement>;
  projectId: string;
  projectName: string;
}

export const ExportPanel = ({ cardRef, projectId, projectName }: ExportPanelProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [showSvgDialog, setShowSvgDialog] = useState(false);
  const [svgCode, setSvgCode] = useState('');
  const [copiedSvg, setCopiedSvg] = useState(false);

  // TODO: Future - Implement backend storage for persistent card sharing
  // For now, we share the app URL so others can create their own
  const shareUrl = window.location.origin;
  const embedCode = `[![DevCard](${shareUrl}/preview-card.png)](${shareUrl})`;

  const secureCopy = async (text: string, onSuccess: () => void) => {
    // 1. Try Modern Async Clipboard API
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        onSuccess();
        return;
      }
    } catch (err) {
      console.warn('Clipboard API failed, attempting fallback...', err);
    }

    // 2. Legacy Fallback (with large text handling)
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;

      // Ensure it's not visible but part of DOM
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);

      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        onSuccess();
      } else {
        throw new Error('Fallback copy failed');
      }
    } catch (err) {
      console.error('Final copy failure:', err);
      toast({
        title: 'Copy failed',
        description: 'Text too large or browser restriction.',
        variant: 'destructive',
      });
    }
  };

  const handleCopySvg = () => {
    secureCopy(svgCode, () => {
      setCopiedSvg(true);
      toast({ title: 'SVG Copied!', description: 'Ready to use.' });
      setTimeout(() => setCopiedSvg(false), 2000);
    });
  };

  const downloadPng = async () => {
    if (!cardRef.current) return;

    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 4,
        backgroundColor: 'transparent',
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}-devcard.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: 'PNG Exported!',
        description: 'High-quality PNG has been saved.',
      });
    } catch (error) {
      console.error('PNG Export Error:', error);
      toast({
        title: 'Export failed',
        description: 'Could not generate PNG. Try using Chrome.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const downloadSvg = async () => {
    if (!cardRef.current) return;

    setIsExporting(true);
    try {
      const dataUrl = await toSvg(cardRef.current, {
        backgroundColor: 'transparent',
      });

      // Robustly extract SVG code
      const [header, content] = dataUrl.split(',');
      const svgContent = header.includes('base64')
        ? atob(content)
        : decodeURIComponent(content);

      setSvgCode(svgContent);
      setShowSvgDialog(true);

      const link = document.createElement('a');
      link.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}-devcard.svg`;
      link.href = dataUrl;
      link.click();

      toast({
        title: 'SVG Exported!',
        description: 'Vector SVG saved & code generated.',
      });
    } catch (error) {
      console.error('SVG Export Error:', error);
      toast({
        title: 'Export failed',
        description: 'Could not generate SVG.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = () => {
    secureCopy(shareUrl, () => {
      setCopiedLink(true);
      toast({ title: 'Link copied!', description: 'Ready to share.' });
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const handleCopyEmbed = () => {
    secureCopy(embedCode, () => {
      setCopiedEmbed(true);
      toast({ title: 'Code copied!', description: 'Ready for GitHub README.' });
      setTimeout(() => setCopiedEmbed(false), 2000);
    });
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`Check out my DevCard! 🚀`);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
        <Download size={16} className="text-primary" />
        Export & Share
      </h3>

      <div className="relative">
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm dark:bg-background/90 text-center p-4 border border-border/50 rounded-lg">
          <p className="font-semibold text-sm mb-2">Export & Share Coming Soon</p>
          <p className="text-xs text-muted-foreground mb-4">
            We are working hard to bring you these features!
          </p>
          <p className="text-xs text-muted-foreground mb-2">
            For now, please take a screenshot or run locally:
          </p>
          <a
            href="https://github.com/Solez-ai/dev-card"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary underline hover:text-primary/80"
          >
            github.com/Solez-ai/dev-card
          </a>
        </div>
        <div className="space-y-4 opacity-50 pointer-events-none filter grayscale">
          {/* Download Options */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Download</p>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button
                onClick={downloadPng}
                disabled={isExporting}
                variant="outline"
                className="gap-2"
              >
                <Image size={16} />
                PNG
              </Button>
              <Button
                onClick={downloadSvg}
                disabled={isExporting}
                variant="outline"
                className="gap-2"
              >
                <FileCode size={16} />
                SVG
              </Button>
            </div>
          </div>

          {/* Share Link */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Share App Link</p>
            <div className="flex gap-2 max-w-full">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1 bg-muted/50 font-mono text-xs border-border truncate"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {copiedLink ? <Check size={16} /> : <Share2 size={16} />}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              *Direct card sharing coming soon in v2.0
            </p>
          </div>

          {/* Embed Code Dialog */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">GitHub README Embed</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2 text-xs">
                  <Code2 size={14} />
                  Get Embed Code
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>GitHub Embed Code</DialogTitle>
                  <DialogDescription>
                    Copy this markdown snippet to your GitHub profile README.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="relative">
                    <Textarea
                      value={embedCode}
                      readOnly
                      className="font-mono text-xs h-[100px] resize-none bg-muted/50"
                      onClick={(e) => e.currentTarget.select()}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 h-8 w-8 p-0"
                      onClick={handleCopyEmbed}
                    >
                      {copiedEmbed ? <Check size={14} /> : <Copy size={14} />}
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>Note: The image preview requires your DevCard to be publicly accessible.</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Social Share */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Share on Social</p>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button
                onClick={shareToTwitter}
                variant="outline"
                className="gap-2"
              >
                <Twitter size={16} />
                Twitter
              </Button>
              <Button
                onClick={shareToLinkedIn}
                variant="outline"
                className="gap-2"
              >
                <Linkedin size={16} />
                LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Code Dialog */}
      <Dialog open={showSvgDialog} onOpenChange={setShowSvgDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>SVG Source Code</DialogTitle>
            <DialogDescription>
              Copy this SVG code to use directly in your HTML or Markdown.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="relative">
              <Textarea
                value={svgCode}
                readOnly
                className="font-mono text-xs h-[150px] resize-none bg-muted/50"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 p-0 z-10 bg-background/80 hover:bg-background backdrop-blur-sm border border-border/50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopySvg();
                }}
              >
                {copiedSvg ? <Check size={14} /> : <Copy size={14} />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
