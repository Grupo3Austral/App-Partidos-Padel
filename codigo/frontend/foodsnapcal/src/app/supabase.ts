import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kpagqfrrcleqtkatmtda.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwYWdxZnJyY2xlcXRrYXRtdGRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjExMzMsImV4cCI6MjA3MTg5NzEzM30.tbNWaV5oTEWC1Cub-4q-0Rxv1c9g46b9YZ3cvu6r28Q';

export const supabase = createClient(supabaseUrl, supabaseKey);
