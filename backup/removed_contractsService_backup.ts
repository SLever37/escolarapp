// Backup do arquivo `servicos/contractsService.ts` removido do fluxo ativo.
// Conteúdo arquivado. Não executar diretamente no app.

/* --- INÍCIO DO CONTEÚDO ARQUIVO ORIGINAL --- */
import { supabase } from './supabaseClient';
import { generateUUID } from '../utils/generators';

// Tipagem mínima local para evitar quebras (adapte conforme seu projeto)
type UserProfile = any;
type Loan = any;
type CapitalSource = any;

const isUUID = (v: any) =>
  typeof v === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
const safeUUID = (v: any) => (isUUID(v) ? v : null);
const ensureUUID = (v: any) => (isUUID(v) ? v : generateUUID());

const safeFloat = (v: any): number => {
  if (typeof v === 'number') return v;
  if (!v && v !== 0) return 0;
  const str = String(v).trim();
  if (str.includes('.') && str.includes(',')) {
    return parseFloat(str.replace(/\./g, '').replace(',', '.')) || 0;
  }
  if (str.includes(',')) {
    return parseFloat(str.replace(',', '.')) || 0;
  }
  return parseFloat(str) || 0;
};

const normalizeDoc = (d: any) => (d ? String(d).replace(/\D/g, '') : null);

async function findOrCreateClient(ownerId: string, loan: Loan) {
  let finalClientId = safeUUID(loan.clientId);
  const cleanName = loan.debtorName?.trim();
  const cleanDoc = normalizeDoc(loan.debtorDocument);

  // 1) Buscar por documento (limpo)
  if (!finalClientId && cleanDoc && cleanDoc.length >= 11) {
    const { data, error } = await supabase
      .from('clientes')
      .select('id')
      .eq('profile_id', ownerId)
      .eq('document', cleanDoc)
      .maybeSingle();
    if (error) throw new Error('Erro ao buscar cliente por documento: ' + error.message);
    if (data) return data.id;
  }

  // 2) Buscar por nome (case-insensitive, parcial)
  if (!finalClientId && cleanName) {
    const { data, error } = await supabase
      .from('clientes')
      .select('id')
      .eq('profile_id', ownerId)
      .ilike('name', `%${cleanName}%`)
      .maybeSingle();
    if (error) throw new Error('Erro ao buscar cliente por nome: ' + error.message);
    if (data) return data.id;
  }

  // 3) Criar novo cliente
  if (!finalClientId && cleanName) {
    const newId = generateUUID();
    const insertPayload = {
      id: newId,
      profile_id: ownerId,
      name: cleanName,
      phone: loan.debtorPhone || null,
      document: cleanDoc || null,
      address: loan.debtorAddress || null,
      access_code: String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
      client_number: String(Math.floor(100000 + Math.random() * 900000)),
      notes: 'Gerado automaticamente ao criar contrato',
      created_at: new Date().toISOString()
    };
    const { error } = await supabase.from('clientes').insert(insertPayload);
    if (error) throw new Error('Erro ao criar cliente: ' + error.message);
    return newId;
  }

  return finalClientId;
}

export const contractsService = {
  async saveLoan(loan: Loan, activeUser: UserProfile, sources: CapitalSource[] = [], editingLoan: Loan | null = null) {
    if (!activeUser?.id) throw new Error('Usuário não autenticado.');

    const ownerId = safeUUID((activeUser as any).supervisor_id) || safeUUID(activeUser.id);
    if (!ownerId) throw new Error('Perfil inválido.');

    const finalClientId = await findOrCreateClient(ownerId, loan);

    const loanId = editingLoan ? loan.id : ensureUUID(loan.id);
    const principal = safeFloat(loan.principal);

    const loanPayload: any = {
      id: loanId,
      profile_id: ownerId,
      operador_responsavel_id: activeUser.accessLevel === 1 ? null : safeUUID(activeUser.id),
      client_id: finalClientId || null,
      source_id: safeUUID(loan.sourceId),
      debtor_name: loan.debtorName || null,
      debtor_phone: loan.debtorPhone || null,
      debtor_document: normalizeDoc(loan.debtorDocument) || null,
      debtor_address: loan.debtorAddress || null,
      preferred_payment_method: loan.preferredPaymentMethod || null,
      pix_key: loan.pixKey || null,
      principal: principal,
      interest_rate: safeFloat(loan.interestRate),
      fine_percent: safeFloat(loan.finePercent),
      daily_interest_percent: safeFloat(loan.dailyInterestPercent),
      billing_cycle: loan.billingCycle || null,
      amortization_type: loan.amortizationType || null,
      start_date: loan.startDate || null,
      total_to_receive: safeFloat(loan.totalToReceive),
      notes: loan.notes || null,
      guarantee_description: loan.guaranteeDescription || null,
      is_archived: !!loan.isArchived,
      funding_total_payable: safeFloat(loan.fundingTotalPayable),
      funding_cost: safeFloat(loan.fundingCost),
      funding_provider: loan.fundingProvider || null,
      funding_fee_percent: safeFloat(loan.fundingFeePercent),
      policies_snapshot: loan.policiesSnapshot || null,
      cliente_foto_url: loan.clientAvatarUrl || null
    };

    if (editingLoan) {
      const { error } = await supabase.from('contratos').update(loanPayload).eq('id', loanId);
      if (error) throw new Error('Erro ao atualizar contrato: ' + error.message);

      if (loan.installments?.length) {
        const instPayload = loan.installments.map((inst: any) => ({
          id: ensureUUID(inst.id),
          loan_id: loanId,
          profile_id: ownerId,
          numero_parcela: inst.number || 1,
          data_vencimento: inst.dueDate || null,
          valor_parcela: safeFloat(inst.amount),
          amount: safeFloat(inst.amount),
          scheduled_principal: safeFloat(inst.scheduledPrincipal),
          scheduled_interest: safeFloat(inst.scheduledInterest),
          principal_remaining: safeFloat(inst.principalRemaining),
          interest_remaining: safeFloat(inst.interestRemaining),
          late_fee_accrued: safeFloat(inst.lateFeeAccrued),
        }));
        const { error: upsertErr } = await supabase.from('parcelas').upsert(instPayload, { onConflict: 'id' });
        if (upsertErr) throw new Error('Erro ao upsert parcelas: ' + upsertErr.message);
      }
    } else {
      const { error } = await supabase.from('contratos').insert({ ...loanPayload, created_at: new Date().toISOString() });
      if (error) throw new Error('Erro ao inserir contrato: ' + error.message);

      if (loan.installments?.length) {
        const instPayload = loan.installments.map((inst: any) => ({
          id: ensureUUID(inst.id),
          loan_id: loanId,
          profile_id: ownerId,
          numero_parcela: inst.number || 1,
          data_vencimento: inst.dueDate || null,
          valor_parcela: safeFloat(inst.amount),
          amount: safeFloat(inst.amount),
          scheduled_principal: safeFloat(inst.scheduledPrincipal),
          scheduled_interest: safeFloat(inst.scheduledInterest),
          principal_remaining: safeFloat(inst.principalRemaining),
          interest_remaining: safeFloat(inst.interestRemaining),
          late_fee_accrued: safeFloat(inst.lateFeeAccrued),
          status: 'PENDING',
          paid_total: 0
        }));
        const { error: instErr } = await supabase.from('parcelas').insert(instPayload);
        if (instErr) throw new Error('Erro ao inserir parcelas: ' + instErr.message);
      }

      if (safeUUID(loan.sourceId)) {
        const rpcResult = await supabase.rpc('adjust_source_balance', { p_source_id: loan.sourceId, p_delta: -principal });
        if (rpcResult.error) throw new Error('Erro ao ajustar fonte: ' + rpcResult.error.message);

        const { error: txErr } = await supabase.from('transacoes').insert({
          id: generateUUID(),
          loan_id: loanId,
          profile_id: ownerId,
          source_id: loan.sourceId,
          date: new Date().toISOString(),
          type: 'LEND_MORE',
          amount: principal,
          principal_delta: 0, interest_delta: 0, late_fee_delta: 0,
          category: 'INVESTIMENTO',
          notes: 'Empréstimo Inicial'
        });
        if (txErr) throw new Error('Erro ao inserir transação: ' + txErr.message);
      }
    }
    return true;
  },

  async saveNote(loanId: string, note: string) {
    if (!isUUID(loanId)) throw new Error('ID inválido.');
    const { error } = await supabase.from('contratos').update({ notes: note }).eq('id', loanId);
    if (error) throw error;
    return true;
  },

  async addAporte(params: { loanId: string; amount: number; sourceId?: string; installmentId?: string; notes?: string; activeUser: UserProfile; }) {
    const { loanId, amount, sourceId, installmentId, notes, activeUser } = params;
    const ownerId = safeUUID((activeUser as any).supervisor_id) || safeUUID(activeUser.id);
    const safeAmount = safeFloat(amount);
    if (safeAmount <= 0) throw new Error('Valor inválido.');

    const { error } = await supabase.rpc('apply_new_aporte_atomic', {
      p_loan_id: loanId,
      p_profile_id: ownerId,
      p_amount: safeAmount,
      p_source_id: safeUUID(sourceId),
      p_installment_id: safeUUID(installmentId),
      p_notes: notes || null,
      p_operator_id: safeUUID(activeUser.id)
    });

    if (error) throw new Error(error.message);
    return true;
  }
};

/* --- FIM DO CONTEÚDO ARQUIVO ORIGINAL --- */
