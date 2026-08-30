// ============================================================
// OSI Flow - Single Card Carousel
// ============================================================

const OSI_LAYERS = [
    {
        id: 7,
        name: 'Application',
        acronym: 'L7',
        pdu: 'Data',
        color: 'from-pink-500 to-rose-500',
        description: 'Provides network services directly to end-user applications. Handles protocols for file transfer, email, and web browsing.',
        assets: ['Web Browsers', 'Email Clients (Outlook, Thunderbird)', 'FTP Clients (FileZilla)', 'API Servers', 'DNS Clients', 'DHCP Clients'],
        encap: 'User data: HTTP, FTP, SMTP, DNS messages',
        decap: 'Delivers original payload to the requesting application',
        protocols: ['HTTP', 'HTTPS', 'FTP', 'SMTP', 'DNS', 'SSH', 'SNMP']
    },
    {
        id: 6,
        name: 'Presentation',
        acronym: 'L6',
        pdu: 'Data',
        color: 'from-violet-500 to-purple-500',
        description: 'Translates data between the application layer and the network. Handles encryption, decryption, compression, and data format conversion.',
        assets: ['SSL/TLS Modules', 'JPEG/PNG Encoders', 'MPEG Codecs', 'ASCII/EBCDIC Converters', 'Encryption Engines (AES, RSA)', 'Compression (gzip, Brotli)'],
        encap: 'Encryption, compression, format translation',
        decap: 'Decryption, decompression, format conversion back to application format',
        protocols: ['SSL', 'TLS', 'JPEG', 'MPEG', 'ASCII', 'EBCDIC', 'S/MIME']
    },
    {
        id: 5,
        name: 'Session',
        acronym: 'L5',
        pdu: 'Data',
        color: 'from-indigo-500 to-blue-500',
        description: 'Establishes, manages, and terminates connections (sessions) between applications. Controls dialogues and synchronization.',
        assets: ['NetBIOS Services', 'RPC (Remote Procedure Call)', 'SQL Connections', 'NFS (Network File System)', 'Session Managers', 'Checkpoint/Recovery Systems'],
        encap: 'Session identifiers, synchronization points, dialog control',
        decap: 'Session termination, checkpoint validation, dialog cleanup',
        protocols: ['NetBIOS', 'RPC', 'SQL', 'PPTP', 'NFS', 'Sockets API']
    },
    {
        id: 4,
        name: 'Transport',
        acronym: 'L4',
        pdu: 'Segment',
        color: 'from-cyan-500 to-teal-500',
        description: 'Provides reliable end-to-end communication. Handles segmentation, reassembly, flow control, and error correction between end systems.',
        assets: ['TCP Stack', 'UDP Stack', 'Socket Libraries', 'Stateful Firewalls', 'Load Balancers', 'NAT Gateways'],
        encap: 'Source/Dest Port Numbers, Sequence Numbers, Checksum, Window Size',
        decap: 'Removes TCP/UDP header, reassembles segments in order, validates checksum',
        protocols: ['TCP', 'UDP', 'SCTP', 'DCCP']
    },
    {
        id: 3,
        name: 'Network',
        acronym: 'L3',
        pdu: 'Packet',
        color: 'from-emerald-500 to-green-500',
        description: 'Handles logical addressing and routing of data packets across different networks. Determines the best path for data delivery.',
        assets: ['Routers', 'IP Stacks', 'ICMP (Ping, Traceroute)', 'ARP Tables', 'NAT Devices', 'Firewalls (stateful)', 'CDN Edge Nodes'],
        encap: 'Source/Dest IP Addresses, TTL, Protocol Type, Fragmentation Info',
        decap: 'Removes IP header, validates TTL, routing/forwarding decision',
        protocols: ['IPv4', 'IPv6', 'ICMP', 'IGMP', 'ARP', 'OSPF', 'BGP']
    },
    {
        id: 2,
        name: 'Data Link',
        acronym: 'L2',
        pdu: 'Frame',
        color: 'from-amber-500 to-orange-500',
        description: 'Provides node-to-node data transfer on the same network segment. Handles physical addressing (MAC), error detection, and access control.',
        assets: ['Switches', 'Network Interface Cards (NICs)', 'Bridges', 'Hubs (Layer 2)', 'Access Points', 'VLAN Taggers'],
        encap: 'Source/Dest MAC Addresses, Frame Type (EtherType), FCS (Frame Check Sequence) trailer',
        decap: 'Removes MAC header & FCS trailer, validates destination MAC, error checking',
        protocols: ['Ethernet (802.3)', 'Wi-Fi (802.11)', 'PPP', 'Frame Relay', 'HDLC', 'VLAN (802.1Q)']
    },
    {
        id: 1,
        name: 'Physical',
        acronym: 'L1',
        pdu: 'Bits',
        color: 'from-red-500 to-pink-500',
        description: 'Transmits raw bit streams over physical media. Defines electrical, mechanical, procedural, and functional specifications for hardware.',
        assets: ['Copper Cables (Cat5e/6/6a)', 'Fiber Optic Cables', 'Repeaters', 'Modems', 'Transceivers (SFP/SFP+)', 'RJ45 Connectors', 'Antennas', 'DSL Splitters'],
        encap: 'Converts bits to electrical/optical/radio signals, bit timing, voltage levels',
        decap: 'Converts electrical/optical/radio signals back to bits, clock recovery',
        protocols: ['Ethernet PHY', 'USB', 'HDMI', 'V.34', 'SONET/SDH', 'Wi-Fi Radio']
    }
];

let currentLayerId = 7;
let isAnimating = false;
let isExpanded = false;

// ============================================================
// Render Progress Numbers
// ============================================================

function renderDots() {
    const dotsContainer = document.getElementById('progress-dots');
    dotsContainer.innerHTML = '';

    OSI_LAYERS.forEach(layer => {
        const num = document.createElement('button');
        num.className = `progress-num ${layer.id === currentLayerId ? 'active' : ''}`;
        num.dataset.layerId = layer.id;
        num.textContent = layer.id;
        num.title = `Layer ${layer.id}: ${layer.name}`;
        num.setAttribute('aria-label', `Go to Layer ${layer.id}: ${layer.name}`);
        num.addEventListener('click', () => {
            if (!isAnimating && layer.id !== currentLayerId) {
                const direction = layer.id > currentLayerId ? 'down' : 'up';
                transitionToLayer(layer.id, direction);
            }
        });
        dotsContainer.appendChild(num);
    });
}

function updateDots() {
    document.querySelectorAll('.progress-num').forEach(num => {
        const id = parseInt(num.dataset.layerId);
        num.className = `progress-num ${id === currentLayerId ? 'active' : ''}`;
    });
}

// ============================================================
// Render Card
// ============================================================

function buildCardHTML(layer) {
    return `
        <div class="card-glow bg-osi-card border border-osi-border rounded-2xl overflow-hidden" id="active-card">
            <div class="p-4 sm:p-6">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${layer.color} flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg flex-shrink-0">
                            ${layer.id}
                        </div>
                        <div>
                            <h3 class="text-base sm:text-lg font-bold text-white">
                                ${layer.name} Layer
                                <span class="text-xs font-medium text-slate-500 ml-1">(${layer.acronym})</span>
                            </h3>
                            <p class="text-xs text-slate-500">PDU: <span class="text-osi-cyan font-medium">${layer.pdu}</span></p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-1 sm:gap-1.5 flex-shrink-0 ml-3">
                        <button class="arrow-btn w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-400"
                                data-direction="up"
                                title="Up (decapsulation)"
                                aria-label="Go up">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"/>
                            </svg>
                        </button>
                        <button class="arrow-btn w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-400"
                                data-direction="down"
                                title="Down (encapsulation)"
                                aria-label="Go down">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <p class="text-sm text-slate-400 leading-relaxed mb-4">${layer.description}</p>

                <div class="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                    ${layer.protocols.map(p => `<span class="px-2 py-1 rounded-md bg-slate-700/50 text-xs text-slate-300 font-medium">${p}</span>`).join('')}
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="encap-tag p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                        <div class="flex items-center gap-2 mb-1">
                            <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                            </svg>
                            <span class="text-xs font-semibold text-emerald-400">ENCAPSULATION (↓)</span>
                        </div>
                        <p class="text-xs text-slate-400">${layer.encap}</p>
                    </div>
                    <div class="encap-tag p-3 rounded-lg bg-violet-500/5 border border-violet-500/20">
                        <div class="flex items-center gap-2 mb-1">
                            <svg class="w-3.5 h-3.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                            </svg>
                            <span class="text-xs font-semibold text-violet-400">DECAPSULATION (↑)</span>
                        </div>
                        <p class="text-xs text-slate-400">${layer.decap}</p>
                    </div>
                </div>
            </div>

            <!-- Expandable -->
            <div class="expanded-content ${isExpanded ? 'open' : ''}" id="expanded-content">
                <div class="px-4 sm:px-6 pb-4 sm:pb-6 pt-3 border-t border-osi-border">
                    <h4 class="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <svg class="w-4 h-4 text-osi-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6m-6 4h6m-6 4h6"/>
                        </svg>
                        Network Assets & Devices
                    </h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        ${layer.assets.map(asset => `
                            <div class="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 text-xs text-slate-300">
                                <span class="w-1.5 h-1.5 rounded-full bg-osi-cyan flex-shrink-0"></span>
                                ${asset}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- Expand toggle -->
            <button class="w-full px-4 py-2.5 text-xs text-slate-500 hover:text-osi-cyan transition-colors flex items-center justify-center gap-1" id="expand-toggle">
                <span id="expand-label">${isExpanded ? 'Collapse' : 'Expand'} details</span>
                <svg class="w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24" id="expand-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
            </button>
        </div>
    `;
}

function renderCard(layer, enterClass = '') {
    const viewport = document.getElementById('card-viewport');
    viewport.innerHTML = `<div class="card-transition ${enterClass}">${buildCardHTML(layer)}</div>`;

    document.getElementById('layer-counter').textContent = `Layer ${layer.id} of 7`;

    bindCardEvents();
}

// ============================================================
// Transition Between Cards
// ============================================================

function transitionToLayer(targetLayerId, direction) {
    isAnimating = true;
    isExpanded = false;

    const viewport = document.getElementById('card-viewport');
    const currentWrapper = viewport.firstElementChild;

    currentWrapper.classList.remove('card-active');
    currentWrapper.classList.add('card-exit');

    setTimeout(() => {
        const targetLayer = OSI_LAYERS.find(l => l.id === targetLayerId);
        currentLayerId = targetLayerId;

        const enterClass = direction === 'up' ? 'card-enter-down' : 'card-enter-up';
        renderCard(targetLayer, enterClass);

        const newWrapper = viewport.firstElementChild;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                newWrapper.classList.remove(enterClass);
                newWrapper.classList.add('card-active');
                updateDots();

                setTimeout(() => {
                    isAnimating = false;
                }, 400);
            });
        });
    }, 400);
}

// ============================================================
// Event Binding
// ============================================================

function bindCardEvents() {
    const card = document.getElementById('active-card');
    if (!card) return;

    // Arrow buttons
    card.querySelectorAll('.arrow-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isAnimating) return;

            const direction = btn.dataset.direction;
            let targetId;

            if (direction === 'up' && currentLayerId < 7) {
                targetId = currentLayerId + 1;
            } else if (direction === 'down' && currentLayerId > 1) {
                targetId = currentLayerId - 1;
            } else {
                return;
            }

            transitionToLayer(targetId, direction);
        });
    });

    // Expand toggle
    const expandToggle = document.getElementById('expand-toggle');
    if (expandToggle) {
        expandToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleExpand();
        });
    }

    // Click card body to toggle expand (excluding arrows)
    card.addEventListener('click', (e) => {
        if (e.target.closest('.arrow-btn')) return;
        toggleExpand();
    });
}

function toggleExpand() {
    const expanded = document.getElementById('expanded-content');
    const label = document.getElementById('expand-label');
    const icon = document.getElementById('expand-icon');

    if (expanded.classList.contains('open')) {
        expanded.classList.remove('open');
        isExpanded = false;
        label.textContent = 'Expand details';
        icon.classList.remove('rotate-180');
    } else {
        expanded.classList.add('open');
        isExpanded = true;
        label.textContent = 'Collapse details';
        icon.classList.add('rotate-180');
    }
}

// ============================================================
// Keyboard Navigation
// ============================================================

document.addEventListener('keydown', (e) => {
    if (isAnimating) return;

    if (e.key === 'ArrowUp' && currentLayerId < 7) {
        transitionToLayer(currentLayerId + 1, 'up');
    } else if (e.key === 'ArrowDown' && currentLayerId > 1) {
        transitionToLayer(currentLayerId - 1, 'down');
    }
});

// ============================================================
// Touch / Swipe Support
// ============================================================

let touchStartY = 0;

document.getElementById('model').addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.getElementById('model').addEventListener('touchend', (e) => {
    if (isAnimating) return;
    const diffY = touchStartY - e.changedTouches[0].clientY;

    if (Math.abs(diffY) > 60) {
        if (diffY > 0 && currentLayerId < 7) {
            transitionToLayer(currentLayerId + 1, 'up');
        } else if (diffY < 0 && currentLayerId > 1) {
            transitionToLayer(currentLayerId - 1, 'down');
        }
    }
}, { passive: true });

// ============================================================
// Initialize
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    const initialLayer = OSI_LAYERS.find(l => l.id === 7);
    renderCard(initialLayer, '');
    renderDots();

    const wrapper = document.getElementById('card-viewport').firstElementChild;
    if (wrapper) wrapper.classList.add('card-active');
});   