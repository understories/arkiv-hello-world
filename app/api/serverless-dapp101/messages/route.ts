import { NextRequest, NextResponse } from 'next/server';
import { getPublicClient, getWalletClientFromPrivateKey } from '../../../../lib/arkiv/client';
import { PROJECT_ATTRIBUTE, getPrivateKey } from '../../../../lib/config';
import { eq } from '@arkiv-network/sdk/query';
import { jsonToPayload, ExpirationTime } from '@arkiv-network/sdk/utils';
import { EntityMutationError } from '@arkiv-network/sdk';

const MESSAGE_TYPE = 'workshop_message';

/**
 * GET /api/serverless-dapp101/messages
 *
 * Lists all messages for this project. Filters by PROJECT_ATTRIBUTE so this
 * query only sees this workshop's data, never other projects sharing Braga.
 */
export async function GET() {
  try {
    const publicClient = getPublicClient();
    const result = await publicClient
      .buildQuery()
      .where([eq(PROJECT_ATTRIBUTE.key, PROJECT_ATTRIBUTE.value), eq('type', MESSAGE_TYPE)])
      .withPayload(true)
      .withAttributes(true)
      .withMetadata(true)
      .limit(100)
      .fetch();

    const messages = result.entities.map((e) => {
      const data = (() => {
        try {
          return e.toJson() as { text?: string; createdAt?: string };
        } catch {
          return {};
        }
      })();
      return {
        id: e.key,
        wallet: (e.owner ?? '').toLowerCase(),
        text: data.text ?? '',
        createdAt: data.createdAt ?? '',
      };
    });

    messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ ok: true, messages });
  } catch (error: any) {
    console.error('[messages/route] Error listing messages:', error?.message);
    return NextResponse.json(
      { ok: false, error: error?.message || 'Failed to list messages', messages: [] },
      { status: 500 },
    );
  }
}

/**
 * POST /api/serverless-dapp101/messages
 * Body: { text: string }
 *
 * Creates one workshop_message entity. Returns the entityKey and txHash so
 * the client can deep-link to the explorer for either view.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text: string | undefined = body?.text;
    if (!text || !text.trim()) {
      return NextResponse.json({ ok: false, error: 'Message text is required' }, { status: 400 });
    }

    const walletClient = getWalletClientFromPrivateKey(getPrivateKey());
    const now = Date.now();

    const { entityKey, txHash } = await walletClient.createEntity({
      payload: jsonToPayload({ text: text.trim(), createdAt: new Date(now).toISOString() }),
      contentType: 'application/json',
      attributes: [
        PROJECT_ATTRIBUTE,
        { key: 'type', value: MESSAGE_TYPE },
        { key: 'createdAtMs', value: now },
      ],
      expiresIn: ExpirationTime.fromDays(180),
    });

    return NextResponse.json({ ok: true, entityKey, txHash });
  } catch (error: any) {
    console.error('[messages/route] Error creating message:', error?.message);
    if (error instanceof EntityMutationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 502 });
    }
    return NextResponse.json(
      { ok: false, error: error?.message || 'Failed to create message' },
      { status: 500 },
    );
  }
}
