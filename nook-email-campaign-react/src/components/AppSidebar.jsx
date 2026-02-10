import * as React from 'react';
import { Mail, Plus, Download, Upload, Copy, RotateCcw, Github, Cloud } from 'lucide-react';
import { useCampaignContext } from '../contexts/CampaignContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarFooter,
} from './ui/sidebar';

export function AppSidebar({
  onOpenSetup,
  onExport,
  onImport,
  onCopyAll,
  onReset,
  onAddCampaign,
  ...props
}) {
  const {
    campaignsData,
    currentCampaignId,
    currentEmailIndex,
    selectCampaign,
    selectEmail,
  } = useCampaignContext();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Mail className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Nook Email Campaign</span>
                <span className="text-xs">Email Editor</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-2">
            <SidebarGroupLabel>Campaigns</SidebarGroupLabel>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={onAddCampaign}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add campaign</span>
            </Button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {campaignsData.campaigns.map((campaign) => (
                <SidebarMenuItem key={campaign.id}>
                  <SidebarMenuButton
                    onClick={() => selectCampaign(campaign.id)}
                    isActive={campaign.id === currentCampaignId}
                    className="font-medium"
                  >
                    {campaign.name}
                    <Badge variant="secondary" className="ml-auto">
                      {campaign.emails.length}
                    </Badge>
                  </SidebarMenuButton>
                  {campaign.id === currentCampaignId && campaign.emails?.length > 0 && (
                    <SidebarMenuSub>
                      {campaign.emails.map((email, index) => (
                        <SidebarMenuSubItem key={index}>
                          <SidebarMenuSubButton
                            onClick={() => selectEmail(index)}
                            isActive={index === currentEmailIndex}
                          >
                            <span className="text-xs text-muted-foreground mr-2">Day {email.day}</span>
                            {email.title}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onOpenSetup}>
                  <Cloud className="w-4 h-4" />
                  <span>Cloud Setup</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onExport}>
                  <Download className="w-4 h-4" />
                  <span>Download JSON</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onImport}>
                  <Upload className="w-4 h-4" />
                  <span>Import JSON</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onCopyAll}>
                  <Copy className="w-4 h-4" />
                  <span>Copy All</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onReset} className="text-destructive">
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset to Defaults</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a
                href="https://github.com/juandel-12/nook-email-campaign"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4" />
                <span>View on GitHub</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
