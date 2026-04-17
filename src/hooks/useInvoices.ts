import * as React from 'react';
import { auth } from '@/src/lib/firebase';
import { Invoice } from '@/src/types';
import { invoiceService } from '@/src/lib/services/invoiceService';

export function useInvoices() {
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!auth.currentUser) {
      setInvoices([]);
      setIsLoading(false);
      return;
    }

    const unsubscribe = invoiceService.subscribeToInvoices(
      auth.currentUser.uid,
      (data) => {
        setInvoices(data);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth.currentUser]);

  const addInvoice = async (invoice: Omit<Invoice, 'id' | 'userId'>) => {
    if (!auth.currentUser) return;
    return await invoiceService.createInvoice({
      ...invoice,
      userId: auth.currentUser.uid,
    });
  };

  const updateInvoice = async (id: string, invoice: Partial<Invoice>) => {
    return await invoiceService.updateInvoice(id, invoice);
  };

  const deleteInvoice = async (id: string) => {
    return await invoiceService.deleteInvoice(id);
  };

  return {
    invoices,
    isLoading,
    addInvoice,
    updateInvoice,
    deleteInvoice,
  };
}
