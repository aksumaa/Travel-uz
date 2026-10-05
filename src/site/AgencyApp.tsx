'use client';

import React, { useState } from 'react';
import { AgencySidebar } from '../components/agency/AgencySidebar';
import { AgencyHeader } from '../components/agency/AgencyHeader';
import { AgencyOverviewView } from '../views/agency/AgencyOverviewView';
import { AgencyPackagesView } from '../views/agency/AgencyPackagesView';
import { AgencyLeadsView } from '../views/agency/AgencyLeadsView';
import { AgencyAnalyticsView } from '../views/agency/AgencyAnalyticsView';
import { AgencyProfileView } from '../views/agency/AgencyProfileView';
import { AgencyVerificationView } from '../views/agency/AgencyVerificationView';
import { AgencySettingsView } from '../views/agency/AgencySettingsView';
import { PackageFormModal } from '../components/agency/PackageFormModal';
import { PackageDetailsModal } from '../components/agency/PackageDetailsModal';
import { LeadDetailDrawer } from '../components/agency/LeadDetailDrawer';
import { packageService } from '../lib/agency/package-service';
import { leadService } from '../lib/agency/lead-service';
import { AgencyPackage, AgencyLead, LeadStatus } from '../lib/agency/types';

interface AgencyAppProps {
  initialView?: 'overview' | 'packages' | 'leads' | 'analytics' | 'profile' | 'verification' | 'settings';
}

export const AgencyApp: React.FC<AgencyAppProps> = ({ initialView = 'overview' }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'packages' | 'leads' | 'analytics' | 'profile' | 'verification' | 'settings'>(initialView);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals & Drawers state
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<AgencyPackage | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<AgencyPackage | null>(null);
  const [selectedLead, setSelectedLead] = useState<AgencyLead | null>(null);

  // Package Actions
  const handleOpenCreatePackage = () => {
    setEditingPackage(null);
    setIsPackageModalOpen(true);
  };

  const handleOpenEditPackage = (pkg: AgencyPackage) => {
    setEditingPackage(pkg);
    setIsPackageModalOpen(true);
  };

  const handleSavePackage = (pkgData: any) => {
    if (editingPackage) {
      packageService.updatePackage(editingPackage.id, pkgData);
    } else {
      packageService.createPackage(pkgData);
    }
  };

  const handleTogglePublishPackage = (id: string) => {
    packageService.togglePublish(id);
    if (selectedPackage && selectedPackage.id === id) {
      setSelectedPackage(packageService.getPackageById(id) || null);
    }
  };

  const handleDuplicatePackage = (id: string) => {
    packageService.duplicatePackage(id);
  };

  const handleDeletePackage = (id: string) => {
    packageService.deletePackage(id);
    setSelectedPackage(null);
  };

  // Lead Actions
  const handleLeadStatusChange = (id: string, status: LeadStatus) => {
    const updated = leadService.updateStatus(id, status);
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead(updated);
    }
  };

  const handleAddLeadNote = (id: string, text: string) => {
    const updated = leadService.addNote(id, 'Agency Staff', text);
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead(updated);
    }
  };

  const viewTitles = {
    overview: { title: 'Agency Overview', subtitle: 'Live business cockpit for published tours & client inquiries' },
    packages: { title: 'Tour Package Management', subtitle: 'Design, price, and publish multi-day travel itineraries' },
    leads: { title: 'Traveler Leads & Inquiries', subtitle: 'Manage quotes, client communication, and booking transitions' },
    analytics: { title: 'Performance Analytics', subtitle: 'Traffic, catalog impressions, and inquiry conversion metrics' },
    profile: { title: 'Agency Business Profile', subtitle: 'Public branding, contact credentials, and specialization story' },
    verification: { title: 'Accreditation & Verification', subtitle: 'Official tourism licensing, insurance, and verification status' },
    settings: { title: 'Agency Workspace Settings', subtitle: 'System localization, currency quotes, and notifications' },
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', position: 'relative' }}>
      
      {/* Persistent Sidebar */}
      <AgencySidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className="agency-main-wrapper"
        style={{
          flex: 1,
          marginLeft: '260px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          minWidth: 0
        }}
      >
        {/* Sticky Header */}
        <AgencyHeader
          title={viewTitles[activeTab]?.title || 'Agency Dashboard'}
          subtitle={viewTitles[activeTab]?.subtitle}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onCreatePackage={handleOpenCreatePackage}
        />

        {/* Dynamic View Body */}
        <main style={{ flex: 1, padding: '28px', maxWidth: '1400px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          {activeTab === 'overview' && (
            <AgencyOverviewView
              onCreatePackage={handleOpenCreatePackage}
              onSelectLead={setSelectedLead}
              onSelectPackage={setSelectedPackage}
            />
          )}

          {activeTab === 'packages' && (
            <AgencyPackagesView
              onCreatePackage={handleOpenCreatePackage}
              onEditPackage={handleOpenEditPackage}
              onViewPackage={setSelectedPackage}
            />
          )}

          {activeTab === 'leads' && (
            <AgencyLeadsView
              onSelectLead={setSelectedLead}
            />
          )}

          {activeTab === 'analytics' && (
            <AgencyAnalyticsView />
          )}

          {activeTab === 'profile' && (
            <AgencyProfileView />
          )}

          {activeTab === 'verification' && (
            <AgencyVerificationView />
          )}

          {activeTab === 'settings' && (
            <AgencySettingsView />
          )}
        </main>
      </div>

      {/* Package Create / Edit Modal */}
      <PackageFormModal
        isOpen={isPackageModalOpen}
        onClose={() => setIsPackageModalOpen(false)}
        onSave={handleSavePackage}
        initialData={editingPackage}
      />

      {/* Package Details Modal */}
      <PackageDetailsModal
        isOpen={Boolean(selectedPackage)}
        pkg={selectedPackage}
        onClose={() => setSelectedPackage(null)}
        onEdit={handleOpenEditPackage}
        onDuplicate={handleDuplicatePackage}
        onTogglePublish={handleTogglePublishPackage}
        onDelete={handleDeletePackage}
      />

      {/* Lead Details Drawer */}
      <LeadDetailDrawer
        isOpen={Boolean(selectedLead)}
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onStatusChange={handleLeadStatusChange}
        onAddNote={handleAddLeadNote}
      />

    </div>
  );
};
