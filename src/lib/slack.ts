// ─── CSUITE Slack Integration ──────────────────────────────────────

export async function sendSlack(message: string, blocks?: any[]) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) {
    console.warn('[Slack] No webhook URL configured');
    return;
  }

  const body: any = { text: message };
  if (blocks) body.blocks = blocks;

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// ─── Pre-built notification templates ──────────────────────────────

export async function notifyContentRun(minutesUntil: number) {
  await sendSlack(
    `🔔 CSUITE — Morning content run in ${minutesUntil} min`,
    [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*🔔 Morning Content Run*\nStarting in ${minutesUntil} minutes. Snowcone will generate content for all live products.`,
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: '🤖 AUTO-APPROVE' },
            style: 'primary',
            url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://rip-dashboard.vercel.app'}/snowcone?mode=auto`,
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: '👁️ REVIEW FIRST' },
            url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://rip-dashboard.vercel.app'}/snowcone`,
          },
        ],
      },
    ]
  );
}

export async function notifyContentGenerated(count: number, products: string[]) {
  await sendSlack(
    `✅ Snowcone generated ${count} content pieces for ${products.join(', ')}`,
    [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*✅ Content Generated*\n${count} pieces across ${products.length} products: ${products.join(', ')}\n\nReady for approval in CSUITE.`,
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: '✅ APPROVE ALL' },
            style: 'primary',
            url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://rip-dashboard.vercel.app'}/snowcone?approve=all`,
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: '👁️ REVIEW' },
            url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://rip-dashboard.vercel.app'}/snowcone`,
          },
        ],
      },
    ]
  );
}

export async function notifySale(product: string, tier: string, amount: number, customer: string) {
  await sendSlack(
    `💰 NEW SALE — ${product} ${tier} — $${amount}`,
    [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*💰 NEW SALE*\n*${product}* — ${tier} tier\n*$${amount}* from ${customer}\n\nLogged to Notion. Dashboard updated.`,
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: '📊 VIEW DASHBOARD' },
            url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://rip-dashboard.vercel.app'}`,
          },
        ],
      },
    ]
  );
}

export async function notifyBlocker(title: string, action: string) {
  await sendSlack(
    `🚨 BLOCKER — ${title}`,
    [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*🚨 Critical Blocker*\n${title}\n\n*Suggested action:* ${action}`,
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: '🔍 INVESTIGATE' },
            style: 'danger',
            url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://rip-dashboard.vercel.app'}/decisions`,
          },
        ],
      },
    ]
  );
}

export async function notifyDailyRecap(revenue: number, sales: number, gap: number, daysLeft: number) {
  await sendSlack(
    `📊 Daily Recap — $${revenue} revenue, ${sales} sales, $${gap} to go`,
    [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*📊 End of Day Recap*\n• Revenue today: *$${revenue}*\n• Sales: *${sales}*\n• Gap to $10K: *$${gap}*\n• Days left: *${daysLeft}*`,
        },
      },
    ]
  );
}
