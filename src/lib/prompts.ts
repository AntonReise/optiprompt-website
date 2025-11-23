/**
 * Saved Prompts Helpers
 * 
 * TODO: Implement these functions once the Supabase database schema is set up.
 * 
 * Expected database schema:
 * - saved_prompts table with columns: id, user_id, title, prompt_text, created_at, updated_at
 */

import { supabase, getSupabaseClient } from './supabaseClient';
import { isSupabaseConfigured } from './supabase';
import { getCurrentUser } from './auth';

export interface SavedPrompt {
  id: string;
  user_id: string;
  title: string;
  prompt_text: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get all saved prompts for the current user
 */
export async function getSavedPrompts(): Promise<SavedPrompt[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const client = getSupabaseClient();

    const { data, error } = await client
      .from('saved_prompts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved prompts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching saved prompts:', error);
    return [];
  }
}

/**
 * Save a new prompt
 */
export async function savePrompt(
  title: string,
  promptText: string
): Promise<{ data: SavedPrompt | null; error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: new Error('Supabase is not configured') };
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const client = getSupabaseClient();

    const { data, error } = await client
      .from('saved_prompts')
      .insert({
        user_id: user.id,
        title,
        prompt_text: promptText,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: new Error(error.message || 'An error occurred') };
  }
}

/**
 * Update a saved prompt
 */
export async function updateSavedPrompt(
  id: string,
  updates: { title?: string; prompt_text?: string }
): Promise<{ data: SavedPrompt | null; error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: new Error('Supabase is not configured') };
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const client = getSupabaseClient();

    const { data, error } = await client
      .from('saved_prompts')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: new Error(error.message || 'An error occurred') };
  }
}

/**
 * Delete a saved prompt
 */
export async function deleteSavedPrompt(id: string): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return { error: new Error('Supabase is not configured') };
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    const client = getSupabaseClient();

    const { error } = await client
      .from('saved_prompts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (error: any) {
    return { error: new Error(error.message || 'An error occurred') };
  }
}

