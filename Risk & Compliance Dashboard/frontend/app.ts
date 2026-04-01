type FeedItem = { id: number; message: string; created_at: string };

type JsonRecord = Record<string, unknown>;

const modules: string[] = [
  'Executive Overview',
  'LTV Monitor',
  'AML Surveillance',
  'End-Use Monitor',
  'Auction Pipeline',
  'KYC Status',
  'Regulatory Reporting',
  'AI Playbooks',
];

const moduleNav = document.getElementById('moduleNav') as HTMLDivElement;
const activeModuleLabel = document.getElementById('activeModuleLabel') as HTMLHeadingElement;
const aiFeed = document.getElementById('aiFeed') as HTMLDivElement;
const aiResponse = document.getElementById('aiResponse') as HTMLParagraphElement;
const aiInput = document.getElementById('aiInput') as HTMLInputElement;
const goldTicker = document.getElementById('goldTicker') as HTMLDivElement;
const ltvBands = document.getElementById('ltvBands') as HTMLDivElement;

let goldPrice = 71240;

const api = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${path}`);
  }
  return response.json() as Promise<T>;
};

const renderModules = (active: string = modules[0]): void => {
  moduleNav.innerHTML = '';
  modules.forEach((moduleName) => {
    const button = document.createElement('button');
    button.className = active === moduleName ? 'nav-btn nav-btn-active' : 'nav-btn';
    button.textContent = moduleName;
    button.onclick = () => {
      activeModuleLabel.textContent = moduleName;
      renderModules(moduleName);
    };
    moduleNav.appendChild(button);
  });
};

const renderBands = (): void => {
  const bands: Array<[string, number]> = [
    ['<65%', 142000],
    ['65–70%', 98000],
    ['70–73%', 31000],
    ['73–75%', 9824],
    ['>75%', goldPrice === 67678 ? 8240 : 3892],
  ];

  ltvBands.innerHTML = '';
  bands.forEach(([name, value]) => {
    const node = document.createElement('article');
    node.className = 'band card';
    node.innerHTML = `<h5>${name}</h5><p>${value.toLocaleString('en-IN')}</p>`;
    ltvBands.appendChild(node);
  });
};

const loadFeed = async (): Promise<void> => {
  try {
    const rows = await api<FeedItem[]>('/api/ai-feed');
    aiFeed.innerHTML = '';
    rows.forEach((row) => {
      const item = document.createElement('div');
      item.className = 'feed-item';
      item.textContent = row.message;
      aiFeed.appendChild(item);
    });
  } catch (error) {
    aiFeed.innerHTML = '<div class="feed-item error">Cannot load feed. Start backend on port 4173.</div>';
  }
};

const recordAction = async (actionType: string, payload: JsonRecord = {}): Promise<void> => {
  await api('/api/actions', {
    method: 'POST',
    body: JSON.stringify({ actionType, payload }),
  });
};

const simulateCrash = async (): Promise<void> => {
  goldPrice = 67678;
  goldTicker.textContent = `MCX Gold ₹${goldPrice.toLocaleString('en-IN')}/10g`;
  renderBands();

  await api('/api/alerts', {
    method: 'POST',
    body: JSON.stringify({
      module: 'LTV Monitor',
      severity: 'critical',
      message: 'Portfolio breach event during crash simulation. 892 → 2,340 accounts in breach.',
    }),
  });

  await api('/api/ai-feed', {
    method: 'POST',
    body: JSON.stringify({
      message: `[${new Date().toLocaleTimeString()}] Crash simulation triggered — AI Playbook activated.`,
    }),
  });

  await recordAction('gold_crash_simulated', { from: 71240, to: 67678 });
  await loadFeed();
};

const handleAIQuery = async (): Promise<void> => {
  const query = aiInput.value.trim();
  if (!query) return;

  let responseText = 'Try: "What\'s our Kerala exposure if gold drops 10%?"';
  const key = query.toLowerCase();

  if (key.includes('kerala') && key.includes('10%')) {
    responseText =
      'If MCX gold falls 10% (₹71,240 → ₹64,116), 8,420 Kerala accounts may breach 75% LTV with ~₹1,240 Cr exposure.';
  } else if (key.includes('str') && key.includes('gl-004821')) {
    responseText =
      'STR Draft ready for GL-004821 (Suresh Menon): 3 structured deposits totaling ₹9.5L across consecutive days.';
  }

  aiResponse.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    i += 1;
    aiResponse.textContent = responseText.slice(0, i);
    if (i >= responseText.length) clearInterval(timer);
  }, 16);

  await recordAction('ai_query', { query, responseText });
  await api('/api/ai-feed', {
    method: 'POST',
    body: JSON.stringify({ message: `[${new Date().toLocaleTimeString()}] AI Query handled: ${query}` }),
  });

  await loadFeed();
  aiInput.value = '';
};

document.getElementById('simulateCrash')?.addEventListener('click', () => {
  void simulateCrash();
});

document.getElementById('aiSend')?.addEventListener('click', () => {
  void handleAIQuery();
});

aiInput.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    void handleAIQuery();
  }
});

renderModules();
renderBands();
void loadFeed();
