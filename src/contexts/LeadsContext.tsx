import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  addLeadLocal,
  deleteLeadLocal,
  listLeads,
  subscribeLocalDb,
  updateLeadLocal,
} from "@/lib/localDb";

export interface Lead {
  id: string;
  propertyId: string;
  propertyTitle: string;
  sellerId: string;
  sellerName: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  message?: string;
  status: 'new' | 'contacted' | 'interested' | 'not-interested' | 'closed';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

interface LeadsContextType {
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<void>;
  updateLeadStatus: (leadId: string, status: Lead['status'], notes?: string) => Promise<void>;
  getLeadsBySeller: (sellerId: string) => Lead[];
  getLeadsByProperty: (propertyId: string) => Lead[];
  deleteLead: (leadId: string) => Promise<void>;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export const LeadsProvider = ({ children }: { children: ReactNode }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const { user } = useAuth();

  const fetchLeads = useCallback(async () => {
    try {
      const all = listLeads();
      if (user?.role === "admin") {
        setLeads(all);
        return;
      }
      if (user?.role === "seller") {
        setLeads(all.filter((l) => l.sellerId === user.id));
        return;
      }
      setLeads([]);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLeads([]);
    }
  }, [user]);

  useEffect(() => {
    fetchLeads();
    const unsub = subscribeLocalDb(fetchLeads);
    return unsub;
  }, [user, fetchLeads]);

  const addLead = async (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    try {
      // Input validation
      if (!lead.buyerName || !lead.buyerName.trim()) {
        throw new Error('Buyer name is required');
      }
      if (!lead.buyerEmail || !lead.buyerEmail.includes('@')) {
        throw new Error('Valid buyer email is required');
      }
      if (!lead.buyerPhone || !lead.buyerPhone.trim()) {
        throw new Error('Buyer phone is required');
      }
      if (!lead.propertyId || !lead.propertyId.trim()) {
        throw new Error('Property ID is required');
      }

      const newLead = addLeadLocal({
        ...lead,
        buyerName: lead.buyerName.trim(),
        buyerEmail: lead.buyerEmail.toLowerCase().trim(),
        buyerPhone: lead.buyerPhone.trim(),
        message: lead.message?.trim() || undefined,
      });
      // Only show instantly if viewer is allowed to see it
      if (user?.role === "admin" || (user?.role === "seller" && newLead.sellerId === user.id)) {
        setLeads((prev) => [newLead, ...prev]);
      }
    } catch (error) {
      console.error('Error adding lead:', error);
      throw error;
    }
  };

  const updateLeadStatus = async (leadId: string, status: Lead['status'], notes?: string) => {
    try {
      updateLeadLocal(leadId, { status, notes: notes?.trim() || undefined });

      setLeads(prev =>
        prev.map(lead =>
          lead.id === leadId
            ? { ...lead, status, notes: notes || lead.notes, updatedAt: new Date().toISOString() }
            : lead
        )
      );
    } catch (error) {
      console.error('Error updating lead status:', error);
      throw error;
    }
  };

  const getLeadsBySeller = (sellerId: string) => {
    return leads.filter(lead => lead.sellerId === sellerId);
  };

  const getLeadsByProperty = (propertyId: string) => {
    return leads.filter(lead => lead.propertyId === propertyId);
  };

  const deleteLead = async (leadId: string) => {
    try {
      deleteLeadLocal(leadId);
      setLeads(prev => prev.filter(lead => lead.id !== leadId));
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  };

  return (
    <LeadsContext.Provider
      value={{
        leads,
        addLead,
        updateLeadStatus,
        getLeadsBySeller,
        getLeadsByProperty,
        deleteLead,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error('useLeads must be used within LeadsProvider');
  }
  return context;
};
