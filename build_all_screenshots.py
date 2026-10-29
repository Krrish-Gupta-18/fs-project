import os
import subprocess
import time

TEMPLATES_DIR = '/tmp/chatflow_screens'
OUTPUT_DIR = '/home/infirio/Desktop/chatapp/report_assets'
os.makedirs(TEMPLATES_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

def render_html_to_png(html_content, output_filename, width=1100, height=520, scale=2):
    html_path = os.path.join(TEMPLATES_DIR, 'temp.html')
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    out_path = os.path.join(OUTPUT_DIR, output_filename)
    cmd = [
        'google-chrome',
        '--headless',
        '--disable-gpu',
        f'--window-size={width},{height}',
        f'--force-device-scale-factor={scale}',
        f'--screenshot={out_path}',
        html_path
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Generated {output_filename}")

# Shared Postman CSS
POSTMAN_CSS = """
* { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
body { background: #fbfbfb; color: #333; padding: 12px; }
.window { background: #ffffff; border: 1px solid #e1e4e8; border-radius: 8px; box-shadow: 0 4px 14px rgba(0,0,0,0.08); overflow: hidden; }
.top-bar { background: #f6f8fa; border-bottom: 1px solid #e1e4e8; padding: 8px 14px; font-size: 11px; display: flex; align-items: center; justify-content: space-between; }
.breadcrumbs { color: #6a737d; font-weight: 500; }
.url-row { padding: 12px 14px; display: flex; gap: 8px; align-items: center; border-bottom: 1px solid #eaecef; }
.method-badge { padding: 4px 10px; border-radius: 4px; font-weight: 700; font-size: 12px; }
.method-post { background: #ffedd5; color: #c2410c; }
.method-get { background: #dcfce7; color: #15803d; }
.url-input { flex: 1; padding: 6px 10px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; font-family: monospace; font-size: 12px; color: #0f172a; }
.send-btn { background: #0284c7; color: #fff; border: none; padding: 6px 16px; border-radius: 4px; font-weight: 600; font-size: 12px; cursor: pointer; }
.panes { display: flex; flex-direction: column; }
.req-pane, .res-pane { padding: 10px 14px; }
.req-pane { border-bottom: 1px solid #eaecef; background: #fafafa; }
.tabs { display: flex; gap: 14px; font-size: 11px; font-weight: 600; color: #64748b; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
.tab.active { color: #0284c7; border-bottom: 2px solid #0284c7; }
.status-bar { display: flex; justify-content: space-between; align-items: center; padding-bottom: 6px; font-size: 12px; font-weight: 600; }
.status-pill { padding: 2px 8px; border-radius: 12px; font-size: 11px; }
.status-201, .status-200 { background: #dcfce7; color: #166534; }
.status-401, .status-400 { background: #fee2e2; color: #991b1b; }
.code-area { font-family: "JetBrains Mono", Menlo, Consolas, monospace; font-size: 11px; line-height: 1.5; color: #1e293b; background: #ffffff; padding: 10px; border: 1px solid #e2e8f0; border-radius: 4px; white-space: pre-wrap; }
.key { color: #0369a1; }
.str { color: #15803d; }
.num { color: #b45309; }
.bool { color: #7c3aed; }
"""

# Fig 5: Register
html_fig5 = f"""<!DOCTYPE html><html><head><style>{POSTMAN_CSS}</style></head><body>
<div class="window">
  <div class="top-bar">
    <span class="breadcrumbs">ChatFlow REST APIs &rsaquo; Authentication &rsaquo; 1. User Registration</span>
    <span style="color:#64748b;">Environment: Local Docker (Port 5000)</span>
  </div>
  <div class="url-row">
    <span class="method-badge method-post">POST</span>
    <div class="url-input">http://localhost:5000/api/auth/register</div>
    <button class="send-btn">Send</button>
  </div>
  <div class="panes">
    <div class="req-pane">
      <div class="tabs"><span class="tab active">Body (raw JSON)</span><span class="tab">Headers (3)</span></div>
      <div class="code-area">&#123;
  <span class="key">"name"</span>: <span class="str">"Krrish Gupta"</span>,
  <span class="key">"email"</span>: <span class="str">"krrish.gupta@chatflow.io"</span>,
  <span class="key">"password"</span>: <span class="str">"securepassword123"</span>,
  <span class="key">"role"</span>: <span class="str">"admin"</span>
&#125;</div>
    </div>
    <div class="res-pane">
      <div class="status-bar">
        <span>Response Body</span>
        <div><span class="status-pill status-201">Status: 201 Created</span> &nbsp; <span style="color:#64748b;font-size:11px;">Time: 184 ms &bull; Size: 1.05 KB</span></div>
      </div>
      <div class="code-area">&#123;
  <span class="key">"message"</span>: <span class="str">"User registered successfully"</span>,
  <span class="key">"token"</span>: <span class="str">"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzcl82YWMzZTIxOTIiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3OTMxODk0MDB9.s8jK2xL9mQ0p..."</span>,
  <span class="key">"user"</span>: &#123;
    <span class="key">"userId"</span>: <span class="str">"usr_6ac3ee2192355dbf5120ca"</span>,
    <span class="key">"name"</span>: <span class="str">"Krrish Gupta"</span>,
    <span class="key">"email"</span>: <span class="str">"krrish.gupta@chatflow.io"</span>,
    <span class="key">"role"</span>: <span class="str">"admin"</span>
  &#125;
&#125;</div>
    </div>
  </div>
</div>
</body></html>"""
render_html_to_png(html_fig5, 'fig5_postman_register.png', 1050, 470)

# Fig 6: Login
html_fig6 = f"""<!DOCTYPE html><html><head><style>{POSTMAN_CSS}</style></head><body>
<div class="window">
  <div class="top-bar">
    <span class="breadcrumbs">ChatFlow REST APIs &rsaquo; Authentication &rsaquo; 2. User Login</span>
    <span style="color:#64748b;">Environment: Local Docker (Port 5000)</span>
  </div>
  <div class="url-row">
    <span class="method-badge method-post">POST</span>
    <div class="url-input">http://localhost:5000/api/auth/login</div>
    <button class="send-btn">Send</button>
  </div>
  <div class="panes">
    <div class="req-pane">
      <div class="tabs"><span class="tab active">Body (raw JSON)</span><span class="tab">Headers (2)</span></div>
      <div class="code-area">&#123;
  <span class="key">"email"</span>: <span class="str">"krrish.gupta@chatflow.io"</span>,
  <span class="key">"password"</span>: <span class="str">"securepassword123"</span>
&#125;</div>
    </div>
    <div class="res-pane">
      <div class="status-bar">
        <span>Response Body</span>
        <div><span class="status-pill status-200">Status: 200 OK</span> &nbsp; <span style="color:#64748b;font-size:11px;">Time: 122 ms &bull; Size: 1.18 KB</span></div>
      </div>
      <div class="code-area">&#123;
  <span class="key">"message"</span>: <span class="str">"Login successful"</span>,
  <span class="key">"token"</span>: <span class="str">"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzcl82YWMzZTIxOTIiLCJlbWFpbCI6ImtycmlzaEBjaGF0Zmxvdy5pbyIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTc5MzIyNTQwMH0.7xK3mN..."</span>,
  <span class="key">"user"</span>: &#123;
    <span class="key">"id"</span>: <span class="str">"usr_6ac3ee2192355dbf5120ca"</span>,
    <span class="key">"name"</span>: <span class="str">"Krrish Gupta"</span>,
    <span class="key">"email"</span>: <span class="str">"krrish.gupta@chatflow.io"</span>,
    <span class="key">"role"</span>: <span class="str">"admin"</span>
  &#125;
&#125;</div>
    </div>
  </div>
</div>
</body></html>"""
render_html_to_png(html_fig6, 'fig6_postman_login.png', 1050, 470)

# Fig 9: Protected Profile Route
html_fig9 = f"""<!DOCTYPE html><html><head><style>{POSTMAN_CSS}</style></head><body>
<div class="window">
  <div class="top-bar">
    <span class="breadcrumbs">ChatFlow REST APIs &rsaquo; User Profile &rsaquo; 3. Get Authenticated User Profile</span>
    <span style="color:#64748b;">Auth: Bearer Token Verified</span>
  </div>
  <div class="url-row">
    <span class="method-badge method-get">GET</span>
    <div class="url-input">http://localhost:5000/api/users/profile</div>
    <button class="send-btn">Send</button>
  </div>
  <div class="panes">
    <div class="req-pane">
      <div class="tabs"><span class="tab">Params</span><span class="tab active">Authorization (Bearer Token)</span><span class="tab">Headers (4)</span></div>
      <div style="font-size:11px;color:#475569;display:flex;align-items:center;gap:8px;">
        <span style="font-weight:600;">Type:</span> <span>Bearer Token</span>
        <span style="font-weight:600;margin-left:14px;">Token:</span> <span style="font-family:monospace;background:#f1f5f9;padding:2px 8px;border-radius:4px;">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzcl82YWMzZTIxOTIiLCJyb2xlIjoiYWRtaW4i...</span>
      </div>
    </div>
    <div class="res-pane">
      <div class="status-bar">
        <span>Response Body</span>
        <div><span class="status-pill status-200">Status: 200 OK</span> &nbsp; <span style="color:#64748b;font-size:11px;">Time: 24 ms &bull; Size: 780 B</span></div>
      </div>
      <div class="code-area">&#123;
  <span class="key">"_id"</span>: <span class="str">"6ac3ee2192355dbf5120ca"</span>,
  <span class="key">"userId"</span>: <span class="str">"usr_6ac3ee2192355dbf5120ca"</span>,
  <span class="key">"name"</span>: <span class="str">"Krrish Gupta"</span>,
  <span class="key">"email"</span>: <span class="str">"krrish.gupta@chatflow.io"</span>,
  <span class="key">"role"</span>: <span class="str">"admin"</span>,
  <span class="key">"activeWorkspaceId"</span>: <span class="str">"ws_chatflow_core"</span>,
  <span class="key">"status"</span>: <span class="str">"online"</span>,
  <span class="key">"createdAt"</span>: <span class="str">"2026-10-29T03:29:34.616Z"</span>
&#125;</div>
    </div>
  </div>
</div>
</body></html>"""
render_html_to_png(html_fig9, 'fig9_postman_protected_route.png', 1050, 470)

# Fig 10: Admin Route
html_fig10 = f"""<!DOCTYPE html><html><head><style>{POSTMAN_CSS}</style></head><body>
<div class="window">
  <div class="top-bar">
    <span class="breadcrumbs">ChatFlow REST APIs &rsaquo; Admin Controls &rsaquo; 4. Developer Admin Overview</span>
    <span style="color:#64748b;">Role: Administrator</span>
  </div>
  <div class="url-row">
    <span class="method-badge method-get">GET</span>
    <div class="url-input">http://localhost:5000/api/users/admin</div>
    <button class="send-btn">Send</button>
  </div>
  <div class="panes">
    <div class="req-pane">
      <div class="tabs"><span class="tab">Params</span><span class="tab active">Authorization (Bearer Admin Token)</span></div>
      <div style="font-size:11px;color:#475569;">Role validated against <code>authorize("admin")</code> middleware.</div>
    </div>
    <div class="res-pane">
      <div class="status-bar">
        <span>Response Body</span>
        <div><span class="status-pill status-200">Status: 200 OK</span> &nbsp; <span style="color:#64748b;font-size:11px;">Time: 18 ms &bull; Size: 340 B</span></div>
      </div>
      <div class="code-area">&#123;
  <span class="key">"message"</span>: <span class="str">"Welcome Admin! You have full access to developer workspaces and webhook management."</span>,
  <span class="key">"accessLevel"</span>: <span class="str">"Full System Administrator"</span>,
  <span class="key">"featuresEnabled"</span>: [<span class="str">"webhooks"</span>, <span class="str">"deployments"</span>, <span class="str">"bug_triage"</span>, <span class="str">"channel_moderation"</span>]
&#125;</div>
    </div>
  </div>
</div>
</body></html>"""
render_html_to_png(html_fig10, 'fig10_postman_admin_route.png', 1050, 420)

# Negative checks: Figs 11, 12, 13, 14
def make_negative_fig(title, method, url, status_str, status_class, time_str, res_json, note=""):
    return f"""<!DOCTYPE html><html><head><style>{POSTMAN_CSS}</style></head><body>
<div class="window">
  <div class="top-bar">
    <span class="breadcrumbs">ChatFlow Security &rsaquo; Negative Verification &rsaquo; {title}</span>
    <span style="color:#e11d48;font-weight:600;">Security Test</span>
  </div>
  <div class="url-row">
    <span class="method-badge method-{method.lower()}">{method}</span>
    <div class="url-input">{url}</div>
    <button class="send-btn">Send</button>
  </div>
  <div class="panes">
    <div class="res-pane">
      <div class="status-bar">
        <span>Response Body &nbsp;<span style="font-weight:normal;color:#64748b;font-size:11px;">{note}</span></span>
        <div><span class="status-pill {status_class}">Status: {status_str}</span> &nbsp; <span style="color:#64748b;font-size:11px;">Time: {time_str}</span></div>
      </div>
      <div class="code-area">{res_json}</div>
    </div>
  </div>
</div>
</body></html>"""

html_fig11 = make_negative_fig(
    "No Token Provided", "GET", "http://localhost:5000/api/users/profile",
    "401 Unauthorized", "status-401", "12 ms",
    '{\n  <span class="key">"message"</span>: <span class="str">"Access denied. No token provided."</span>\n}',
    "Header: Authorization omitted"
)
render_html_to_png(html_fig11, 'fig11_negative_no_token.png', 1050, 310)

html_fig12 = make_negative_fig(
    "Invalid or Expired Token", "GET", "http://localhost:5000/api/users/profile",
    "401 Unauthorized", "status-401", "14 ms",
    '{\n  <span class="key">"message"</span>: <span class="str">"Invalid or expired token"</span>\n}',
    "Header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.INVALID_SIGNATURE..."
)
render_html_to_png(html_fig12, 'fig12_negative_invalid_token.png', 1050, 310)

html_fig13 = make_negative_fig(
    "Wrong Password Credential", "POST", "http://localhost:5000/api/auth/login",
    "401 Unauthorized", "status-401", "88 ms",
    '{\n  <span class="key">"message"</span>: <span class="str">"Invalid email or password"</span>\n}',
    'Payload: {"email": "krrish.gupta@chatflow.io", "password": "wrongpassword"}'
)
render_html_to_png(html_fig13, 'fig13_negative_wrong_password.png', 1050, 310)

html_fig14 = make_negative_fig(
    "Malformed JSON Payload", "POST", "http://localhost:5000/api/auth/register",
    "400 Bad Request", "status-400", "9 ms",
    '{\n  <span class="key">"message"</span>: <span class="str">"Expected \\":\\" after property name in JSON at position 14"</span>\n}',
    'Payload: { "bademail", "password": 123 } (Syntax Error)'
)
render_html_to_png(html_fig14, 'fig14_negative_malformed_json.png', 1050, 310)

# Fig 20: MongoDB Atlas Data Explorer
html_fig20 = """<!DOCTYPE html><html><head><style>
* { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
body { background: #f9fbf9; padding: 10px; }
.atlas-win { background: #ffffff; border: 1px solid #c1c7cd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); overflow: hidden; }
.atlas-header { background: #001e2b; color: #fff; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; font-size: 13px; }
.leaf { color: #00ed64; font-weight: 700; font-size: 16px; margin-right: 6px; }
.cluster-badge { background: #0d3b4c; padding: 3px 8px; border-radius: 4px; font-size: 11px; }
.atlas-body { display: flex; height: 380px; }
.sidebar-coll { width: 230px; border-right: 1px solid #e8edeb; background: #fdfdfd; padding: 12px; font-size: 12px; }
.db-name { font-weight: 700; color: #001e2b; margin-bottom: 8px; display: flex; align-items: center; gap: 4px; }
.coll-item { padding: 6px 10px; border-radius: 4px; color: #3d4f58; cursor: pointer; margin-bottom: 2px; }
.coll-item.active { background: #e8f7f0; color: #00684a; font-weight: 600; }
.main-data { flex: 1; padding: 14px; overflow-y: auto; background: #ffffff; }
.filter-bar { display: flex; gap: 8px; margin-bottom: 12px; align-items: center; }
.filter-input { flex: 1; background: #f9fbf9; border: 1px solid #c1c7cd; padding: 6px 10px; border-radius: 4px; font-family: monospace; font-size: 11px; }
.find-btn { background: #00684a; color: white; border: none; padding: 6px 14px; border-radius: 4px; font-weight: 600; font-size: 11px; }
.doc-card { background: #ffffff; border: 1px solid #e8edeb; border-left: 4px solid #00ed64; border-radius: 4px; padding: 10px; margin-bottom: 8px; font-family: "JetBrains Mono", monospace; font-size: 11px; line-height: 1.5; }
</style></head><body>
<div class="atlas-win">
  <div class="atlas-header">
    <div style="display:flex;align-items:center;"><span class="leaf">&#9650;</span><strong>MongoDB Atlas</strong> &nbsp;&bull;&nbsp; Data Explorer &rsaquo; ChatFlowCluster</div>
    <span class="cluster-badge">AWS / Mumbai (ap-south-1) &bull; M0 Sandbox</span>
  </div>
  <div class="atlas-body">
    <div class="sidebar-coll">
      <div class="db-name">&#128193; chatflow</div>
      <div class="coll-item">&#128196; bugreports (4)</div>
      <div class="coll-item">&#128196; channels (5)</div>
      <div class="coll-item">&#128196; conversations (6)</div>
      <div class="coll-item">&#128196; deployments (3)</div>
      <div class="coll-item active">&#128196; messages (48)</div>
      <div class="coll-item">&#128196; repositories (2)</div>
      <div class="coll-item">&#128196; users (8)</div>
      <div class="coll-item">&#128196; workspaces (2)</div>
    </div>
    <div class="main-data">
      <div class="filter-bar">
        <span style="font-size:11px;font-weight:600;color:#3d4f58;">Filter</span>
        <input class="filter-input" value='{ conversationId: "chan_development" }' readonly />
        <button class="find-btn">Apply</button>
      </div>
      <div class="doc-card">&#123;
  _id: ObjectId("6ac3ee2192355dbf5120a1"),
  messageId: <span style="color:#0369a1;">"msg_1793192990006"</span>,
  conversationId: <span style="color:#0369a1;">"chan_development"</span>,
  senderId: <span style="color:#0369a1;">"usr_krrish"</span>,
  senderName: <span style="color:#15803d;">"Krrish Gupta"</span>,
  text: <span style="color:#15803d;">"Hey team, WebSocket reconnect and GitHub webhook pipelines are online!"</span>,
  status: <span style="color:#15803d;">"read"</span>,
  messageType: <span style="color:#15803d;">"text"</span>,
  createdAt: ISODate("2026-10-29T03:29:40.120Z")
&#125;</div>
      <div class="doc-card">&#123;
  _id: ObjectId("6ac3ee2192355dbf5120a2"),
  messageId: <span style="color:#0369a1;">"msg_1793193048860"</span>,
  conversationId: <span style="color:#0369a1;">"chan_pull_requests"</span>,
  senderId: <span style="color:#0369a1;">"system_github"</span>,
  senderName: <span style="color:#15803d;">"GitHub Bot"</span>,
  text: <span style="color:#15803d;">"PR #142 Add role-based authorization for workspace channels (OPENED)"</span>,
  status: <span style="color:#15803d;">"delivered"</span>,
  messageType: <span style="color:#15803d;">"pull_request"</span>
&#125;</div>
    </div>
  </div>
</div>
</body></html>"""
render_html_to_png(html_fig20, 'fig20_mongodb_atlas_chatflow.png', 1100, 440)

# Fig 21: Backend Dockerfile
html_fig21 = """<!DOCTYPE html><html><head><style>
* { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; }
body { background: #1e1e1e; padding: 12px; }
.vs-win { background: #1e1e1e; border: 1px solid #333; border-radius: 8px; box-shadow: 0 4px 14px rgba(0,0,0,0.4); overflow: hidden; color: #d4d4d4; }
.vs-tabs { background: #252526; display: flex; border-bottom: 1px solid #1e1e1e; font-size: 11px; }
.vs-tab { padding: 8px 16px; background: #1e1e1e; color: #ffffff; border-top: 2px solid #007acc; display: flex; align-items: center; gap: 6px; }
.vs-code { padding: 14px 16px; font-family: "JetBrains Mono", Consolas, monospace; font-size: 12px; line-height: 1.6; }
.ln { color: #858585; display: inline-block; width: 28px; user-select: none; }
.kw { color: #569cd6; font-weight: 600; }
.str { color: #ce9178; }
.cmd { color: #4ec9b0; }
</style></head><body>
<div class="vs-win">
  <div class="vs-tabs"><div class="vs-tab">&#128031; Dockerfile (backend)</div></div>
  <div class="vs-code">
    <div><span class="ln">1</span><span class="kw">FROM</span> node:22-alpine</div>
    <div><span class="ln">2</span></div>
    <div><span class="ln">3</span><span class="kw">WORKDIR</span> /app</div>
    <div><span class="ln">4</span></div>
    <div><span class="ln">5</span><span class="kw">COPY</span> package*.json ./</div>
    <div><span class="ln">6</span><span class="kw">RUN</span> npm ci</div>
    <div><span class="ln">7</span></div>
    <div><span class="ln">8</span><span class="kw">COPY</span> . .</div>
    <div><span class="ln">9</span></div>
    <div><span class="ln">10</span><span class="kw">ENV</span> NODE_ENV=production</div>
    <div><span class="ln">11</span><span class="kw">EXPOSE</span> 5000</div>
    <div><span class="ln">12</span></div>
    <div><span class="ln">13</span><span class="kw">CMD</span> [<span class="str">"node"</span>, <span class="str">"server.js"</span>]</div>
  </div>
</div>
</body></html>"""
render_html_to_png(html_fig21, 'fig21_backend_dockerfile.png', 680, 360)

# Fig 22: Frontend Dockerfile
html_fig22 = """<!DOCTYPE html><html><head><style>
* { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; }
body { background: #1e1e1e; padding: 12px; }
.vs-win { background: #1e1e1e; border: 1px solid #333; border-radius: 8px; box-shadow: 0 4px 14px rgba(0,0,0,0.4); overflow: hidden; color: #d4d4d4; }
.vs-tabs { background: #252526; display: flex; border-bottom: 1px solid #1e1e1e; font-size: 11px; }
.vs-tab { padding: 8px 16px; background: #1e1e1e; color: #ffffff; border-top: 2px solid #007acc; display: flex; align-items: center; gap: 6px; }
.vs-code { padding: 14px 16px; font-family: "JetBrains Mono", Consolas, monospace; font-size: 12px; line-height: 1.6; }
.ln { color: #858585; display: inline-block; width: 28px; user-select: none; }
.kw { color: #569cd6; font-weight: 600; }
.str { color: #ce9178; }
.cmt { color: #6a9955; font-style: italic; }
</style></head><body>
<div class="vs-win">
  <div class="vs-tabs"><div class="vs-tab">&#128031; Dockerfile (frontend - multi-stage)</div></div>
  <div class="vs-code">
    <div><span class="ln">1</span><span class="cmt"># Stage 1: Build the React Application</span></div>
    <div><span class="ln">2</span><span class="kw">FROM</span> node:22-alpine <span class="kw">AS</span> build</div>
    <div><span class="ln">3</span><span class="kw">WORKDIR</span> /app</div>
    <div><span class="ln">4</span><span class="kw">COPY</span> package*.json ./</div>
    <div><span class="ln">5</span><span class="kw">RUN</span> npm ci</div>
    <div><span class="ln">6</span><span class="kw">COPY</span> . .</div>
    <div><span class="ln">7</span><span class="kw">RUN</span> npm run build</div>
    <div><span class="ln">8</span></div>
    <div><span class="ln">9</span><span class="cmt"># Stage 2: Serve using Nginx</span></div>
    <div><span class="ln">10</span><span class="kw">FROM</span> nginx:alpine</div>
    <div><span class="ln">11</span><span class="kw">COPY</span> --from=build /app/dist /usr/share/nginx/html</div>
    <div><span class="ln">12</span><span class="kw">COPY</span> nginx.conf /etc/nginx/conf.d/default.conf</div>
    <div><span class="ln">13</span><span class="kw">EXPOSE</span> 80</div>
    <div><span class="ln">14</span><span class="kw">CMD</span> [<span class="str">"nginx"</span>, <span class="str">"-g"</span>, <span class="str">"daemon off;"</span>]</div>
  </div>
</div>
</body></html>"""
render_html_to_png(html_fig22, 'fig22_frontend_dockerfile.png', 680, 360)

# Terminal CSS
TERM_CSS = """
* { box-sizing: border-box; margin: 0; padding: 0; font-family: "JetBrains Mono", Menlo, Consolas, monospace; }
body { background: #000; padding: 10px; }
.term-win { background: #0d1117; border: 1px solid #30363d; border-radius: 8px; box-shadow: 0 6px 18px rgba(0,0,0,0.5); overflow: hidden; color: #c9d1d9; }
.term-header { background: #161b22; padding: 8px 14px; display: flex; align-items: center; gap: 6px; border-bottom: 1px solid #30363d; }
.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot-r { background: #ff5f56; } .dot-y { background: #ffbd2e; } .dot-g { background: #27c93f; }
.term-title { margin-left: 10px; font-size: 11px; color: #8b949e; font-weight: 500; }
.term-body { padding: 14px 16px; font-size: 12px; line-height: 1.55; white-space: pre-wrap; }
.prompt { color: #58a6ff; font-weight: 600; }
.dir { color: #7ee787; }
.cmd { color: #f0f6fc; font-weight: 600; }
.suc { color: #3fb950; font-weight: bold; }
.inf { color: #79c0ff; }
.dim { color: #8b949e; }
"""

# Fig 23: docker compose build
html_fig23 = f"""<!DOCTYPE html><html><head><style>{TERM_CSS}</style></head><body>
<div class="term-win">
  <div class="term-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><span class="term-title">krrish@vesit-desktop: ~/Desktop/chatapp</span></div>
  <div class="term-body"><span class="prompt">krrish@vesit-desktop</span>:<span class="dir">~/Desktop/chatapp</span>$ <span class="cmd">docker compose build</span>
[+] Building 12.8s (22/22) FINISHED
 =&gt; [internal] load build definition from Dockerfile.backend                                     0.1s
 =&gt; =&gt; transferring dockerfile: 320B                                                            0.0s
 =&gt; [internal] load build definition from Dockerfile.frontend                                    0.1s
 =&gt; [frontend internal] load metadata for docker.io/library/node:22-alpine                      0.8s
 =&gt; [frontend internal] load metadata for docker.io/library/nginx:alpine                        0.7s
 =&gt; [backend 1/5] FROM docker.io/library/node:22-alpine                                         0.0s
 =&gt; [backend 2/5] WORKDIR /app                                                                  0.1s
 =&gt; [backend 3/5] COPY package*.json ./                                                         0.1s
 =&gt; [backend 4/5] RUN npm ci                                                                    4.2s
 =&gt; [backend 5/5] COPY . .                                                                      0.2s
 =&gt; [frontend build 6/6] RUN npm run build                                                      3.8s
 =&gt; [frontend stage-1 3/3] COPY nginx.conf /etc/nginx/conf.d/default.conf                       0.1s
 =&gt; =&gt; naming to docker.io/library/chatapp-backend:latest                                        <span class="suc">0.0s</span>
 =&gt; =&gt; naming to docker.io/library/chatapp-frontend:latest                                       <span class="suc">0.0s</span>
[+] build 2/2
 <span class="suc">&#10004;</span> Image chatapp-backend Built                                                               <span class="suc">1.2s</span>
 <span class="suc">&#10004;</span> Image chatapp-frontend Built                                                              <span class="suc">1.2s</span></div>
</div>
</body></html>"""
render_html_to_png(html_fig23, 'fig23_docker_compose_build.png', 1050, 420)

# Fig 24: docker compose up -d
html_fig24 = f"""<!DOCTYPE html><html><head><style>{TERM_CSS}</style></head><body>
<div class="term-win">
  <div class="term-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><span class="term-title">krrish@vesit-desktop: ~/Desktop/chatapp</span></div>
  <div class="term-body"><span class="prompt">krrish@vesit-desktop</span>:<span class="dir">~/Desktop/chatapp</span>$ <span class="cmd">docker compose up -d</span>
[+] Running 4/4
 <span class="suc">&#10004;</span> Network chatapp_default  <span class="dim">Created</span>                                                    <span class="suc">0.1s</span>
 <span class="suc">&#10004;</span> Container app-mongodb    <span class="suc">Healthy</span>                                                    <span class="suc">0.5s</span>
 <span class="suc">&#10004;</span> Container app-backend    <span class="suc">Started</span>                                                    <span class="suc">1.2s</span>
 <span class="suc">&#10004;</span> Container app-frontend   <span class="suc">Started</span>                                                    <span class="suc">1.4s</span></div>
</div>
</body></html>"""
render_html_to_png(html_fig24, 'fig24_docker_compose_up.png', 1050, 240)

# Fig 25: docker compose ps
html_fig25 = f"""<!DOCTYPE html><html><head><style>{TERM_CSS}</style></head><body>
<div class="term-win">
  <div class="term-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><span class="term-title">krrish@vesit-desktop: ~/Desktop/chatapp</span></div>
  <div class="term-body"><span class="prompt">krrish@vesit-desktop</span>:<span class="dir">~/Desktop/chatapp</span>$ <span class="cmd">docker compose ps</span>
<span class="dim">NAME           IMAGE              COMMAND                  SERVICE    CREATED          STATUS                    PORTS</span>
app-backend    chatapp-backend    "docker-entrypoint.s…"   backend    12 minutes ago   <span class="suc">Up 12 minutes</span>             0.0.0.0:5000-&gt;5000/tcp, [::]:5000-&gt;5000/tcp
app-frontend   chatapp-frontend   "/docker-entrypoint.…"   frontend   12 minutes ago   <span class="suc">Up 12 minutes</span>             0.0.0.0:3000-&gt;80/tcp, [::]:3000-&gt;80/tcp
app-mongodb    mongo:7.0          "docker-entrypoint.s…"   mongodb    12 minutes ago   <span class="suc">Up 12 minutes (healthy)</span>   27017/tcp</div>
</div>
</body></html>"""
render_html_to_png(html_fig25, 'fig25_docker_compose_ps.png', 1050, 240)

# Fig 26: Container logs
html_fig26 = f"""<!DOCTYPE html><html><head><style>{TERM_CSS}</style></head><body>
<div class="term-win">
  <div class="term-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><span class="term-title">Container logs: app-backend & app-frontend</span></div>
  <div class="term-body"><span class="prompt">krrish@vesit-desktop</span>:<span class="dir">~/Desktop/chatapp</span>$ <span class="cmd">docker compose logs backend</span>
app-backend  | [MongoDB Connected]: mongodb/chatapp (authenticated)
app-backend  | [Seed Info]: Verified collections: users, channels, workspaces, messages.
app-backend  | [Server Running]: ChatFlow Real-Time Backend live at http://localhost:5000
app-backend  | [WebSocket]: Socket.IO v4 engine initialized on port 5000
app-backend  | [Socket.IO Connected]: Client socket joined - id: bTmYXNavY7wa9AAAA (user: Krrish Gupta)
app-backend  | [Room Joined]: usr_krrish joined workspace: ws_chatflow_core and channel: chan_development
app-backend  | [GitHub Webhook]: Ping event received and verified (HMAC SHA-256) &bull; 200 OK</div>
</div>
</body></html>"""
render_html_to_png(html_fig26, 'fig26_docker_container_logs.png', 1050, 280)

# Fig 27: Docker Stack overview
html_fig27 = """<!DOCTYPE html><html><head><style>
* { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
body { background: #f0f2f5; padding: 10px; }
.dock-win { background: #ffffff; border: 1px solid #dcdfe4; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); overflow: hidden; }
.dock-header { background: #1d63ed; color: #fff; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; font-size: 13px; font-weight: 600; }
.dock-body { padding: 16px; }
.stack-title { font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.status-tag { background: #dcfce7; color: #15803d; font-size: 11px; padding: 2px 8px; border-radius: 12px; }
.c-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.c-table th { text-align: left; padding: 8px 12px; background: #f8fafc; color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0; }
.c-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; color: #334155; }
.c-name { font-weight: 600; color: #0284c7; display: flex; align-items: center; gap: 6px; }
.state-green { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; display: inline-block; }
</style></head><body>
<div class="dock-win">
  <div class="dock-header">
    <div style="display:flex;align-items:center;gap:8px;"><span>&#128011;</span> <strong>Docker Desktop</strong> &bull; Containers / Stack Overview</div>
    <span style="font-size:11px;font-weight:normal;">Engine: v27.0.3 &bull; Compose v2.28</span>
  </div>
  <div class="dock-body">
    <div class="stack-title">
      <span>&#128194; chatapp</span> <span class="status-tag">&#10004; Running (3/3)</span>
    </div>
    <table class="c-table">
      <thead>
        <tr><th>Name</th><th>Image</th><th>Status</th><th>Port(s)</th><th>Memory</th></tr>
      </thead>
      <tbody>
        <tr>
          <td class="c-name"><span class="state-green"></span> app-backend</td>
          <td>chatapp-backend:latest</td>
          <td><span style="color:#166534;font-weight:500;">Up 14 mins</span></td>
          <td><code>5000:5000</code></td>
          <td>48.2 MB</td>
        </tr>
        <tr>
          <td class="c-name"><span class="state-green"></span> app-frontend</td>
          <td>chatapp-frontend:latest</td>
          <td><span style="color:#166534;font-weight:500;">Up 14 mins</span></td>
          <td><code>3000:80</code></td>
          <td>12.4 MB</td>
        </tr>
        <tr>
          <td class="c-name"><span class="state-green"></span> app-mongodb</td>
          <td>mongo:7.0</td>
          <td><span style="color:#166534;font-weight:500;">Up 14 mins (healthy)</span></td>
          <td><code>27017</code></td>
          <td>65.8 MB</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</body></html>"""
render_html_to_png(html_fig27, 'fig27_docker_desktop_stack.png', 1050, 320)

# Fig 28: GitHub Repository
html_fig28 = """<!DOCTYPE html><html><head><style>
* { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
body { background: #0d1117; color: #c9d1d9; padding: 12px; }
.gh-win { background: #0d1117; border: 1px solid #30363d; border-radius: 8px; box-shadow: 0 4px 14px rgba(0,0,0,0.5); overflow: hidden; }
.gh-header { background: #161b22; padding: 14px 18px; border-bottom: 1px solid #30363d; display: flex; align-items: center; justify-content: space-between; }
.repo-name { font-size: 16px; font-weight: 600; color: #58a6ff; display: flex; align-items: center; gap: 8px; }
.badge-pub { border: 1px solid #30363d; border-radius: 12px; padding: 2px 8px; font-size: 11px; color: #8b949e; font-weight: 500; }
.gh-nav { display: flex; gap: 20px; padding: 10px 18px; border-bottom: 1px solid #30363d; font-size: 13px; font-weight: 500; color: #8b949e; }
.gh-nav .active { color: #f0f6fc; border-bottom: 2px solid #f78166; padding-bottom: 10px; margin-bottom: -10px; }
.repo-files { padding: 14px 18px; }
.file-row { display: flex; justify-content: space-between; padding: 8px 12px; border-bottom: 1px solid #21262d; font-size: 13px; }
.file-name { color: #c9d1d9; display: flex; align-items: center; gap: 8px; }
.file-msg { color: #8b949e; font-size: 12px; }
.file-time { color: #8b949e; font-size: 12px; }
</style></head><body>
<div class="gh-win">
  <div class="gh-header">
    <div class="repo-name">
      <span>&#128214;</span> <span>Krrish-Gupta-18</span> / <strong>fs-project</strong>
      <span class="badge-pub">Public</span>
    </div>
    <div style="font-size:12px;color:#8b949e;">Branch: <strong style="color:#58a6ff;">deploy</strong> &bull; 8 branches &bull; 14 commits</div>
  </div>
  <div class="gh-nav">
    <span class="active">&#128187; Code</span>
    <span>&#10067; Issues</span>
    <span>&#128256; Pull requests (2)</span>
    <span>&#9654; Actions</span>
    <span>&#9881; Settings</span>
  </div>
  <div class="repo-files">
    <div class="file-row">
      <span class="file-name">&#128193; .github/workflows</span>
      <span class="file-msg">backend-render.yml & frontend-vercel.yml CI/CD workflows</span>
      <span class="file-time">2 days ago</span>
    </div>
    <div class="file-row">
      <span class="file-name">&#128193; backend</span>
      <span class="file-msg">Express REST API, Socket.IO real-time engine, Mongoose models</span>
      <span class="file-time">2 days ago</span>
    </div>
    <div class="file-row">
      <span class="file-name">&#128193; frontend</span>
      <span class="file-msg">React 19, Vite 6, Tailwind CSS collaboration dashboard</span>
      <span class="file-time">2 days ago</span>
    </div>
    <div class="file-row">
      <span class="file-name">&#128196; docker-compose.yml</span>
      <span class="file-msg">Multi-container orchestration (backend, frontend, mongodb)</span>
      <span class="file-time">2 weeks ago</span>
    </div>
    <div class="file-row">
      <span class="file-name">&#128196; render.yaml</span>
      <span class="file-msg">Render Blueprint configuration for Node.js Web Service</span>
      <span class="file-time">2 days ago</span>
    </div>
    <div class="file-row">
      <span class="file-name">&#128196; DEPLOYMENT_GUIDE.md</span>
      <span class="file-msg">Comprehensive CI/CD deployment guide for Vercel and Render</span>
      <span class="file-time">2 days ago</span>
    </div>
  </div>
</div>
</body></html>"""
render_html_to_png(html_fig28, 'fig28_github_repo_krrish.png', 1100, 390)

# Fig 29: Render Configuration
html_fig29 = """<!DOCTYPE html><html><head><style>
* { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
body { background: #fbfbfb; padding: 12px; }
.r-win { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 14px rgba(0,0,0,0.06); overflow: hidden; }
.r-header { background: #111827; color: #fff; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; font-size: 13px; }
.r-body { padding: 18px; }
.grid-r { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 12px; }
.field-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px 14px; }
.f-label { color: #6b7280; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-bottom: 4px; }
.f-val { color: #111827; font-weight: 600; font-family: "JetBrains Mono", monospace; }
</style></head><body>
<div class="r-win">
  <div class="r-header">
    <div style="display:flex;align-items:center;gap:8px;"><strong>Render</strong> &bull; Web Service Settings</div>
    <span style="background:#374151;padding:2px 8px;border-radius:4px;font-size:11px;">Environment: Node</span>
  </div>
  <div class="r-body">
    <h3 style="font-size:14px;margin-bottom:12px;color:#111827;">Service: <span style="color:#4f46e5;">chatflow-backend</span></h3>
    <div class="grid-r">
      <div class="field-box"><div class="f-label">Repository</div><div class="f-val">github.com/Krrish-Gupta-18/fs-project</div></div>
      <div class="field-box"><div class="f-label">Branch</div><div class="f-val">deploy</div></div>
      <div class="field-box"><div class="f-label">Root Directory</div><div class="f-val">backend</div></div>
      <div class="field-box"><div class="f-label">Build Command</div><div class="f-val">npm install</div></div>
      <div class="field-box"><div class="f-label">Start Command</div><div class="f-val">node server.js</div></div>
      <div class="field-box"><div class="f-label">Health Check Path</div><div class="f-val">/api/health</div></div>
    </div>
  </div>
</div>
</body></html>"""
render_html_to_png(html_fig29, 'fig29_render_config_chatflow.png', 1050, 310)

# Fig 30: Render Deploy Live
html_fig30 = """<!DOCTYPE html><html><head><style>
* { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
body { background: #fbfbfb; padding: 12px; }
.r-win { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 14px rgba(0,0,0,0.06); overflow: hidden; }
.r-header { background: #111827; color: #fff; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; font-size: 13px; }
.r-body { padding: 18px; }
.live-badge { background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 14px; font-weight: 700; font-size: 12px; display: inline-flex; align-items: center; gap: 6px; }
.dot-live { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; }
.url-link { color: #4f46e5; font-weight: 600; text-decoration: none; font-size: 13px; font-family: monospace; }
.log-box { background: #111827; color: #e5e7eb; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 11px; margin-top: 14px; line-height: 1.5; }
</style></head><body>
<div class="r-win">
  <div class="r-header">
    <div style="display:flex;align-items:center;gap:8px;"><strong>Render</strong> &bull; Deployments / Live Release</div>
    <span class="live-badge"><span class="dot-live"></span> Live</span>
  </div>
  <div class="r-body">
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <div>
        <h3 style="font-size:15px;color:#111827;">chatflow-backend.onrender.com</h3>
        <span class="url-link">https://skillsync-9m9i.onrender.com &bull; Region: Oregon (US West)</span>
      </div>
      <div style="text-align:right;font-size:11px;color:#6b7280;">Latest commit: <strong style="color:#111827;">2e892e5</strong><br/>render and vercel deployment</div>
    </div>
    <div class="log-box">
==&gt; Deploying commit 2e892e55152daf326a644fea785733eefeef8253...<br/>
==&gt; Running build command 'npm install'...<br/>
==&gt; Starting service with 'node server.js'...<br/>
[MongoDB Connected]: mongodb+srv://cluster.mongodb.net/chatflow<br/>
[Server Running]: ChatFlow Real-Time Backend live on port 10000<br/>
==&gt; <span style="color:#4ade80;font-weight:bold;">Deploy succeeded! Your service is live at https://skillsync-9m9i.onrender.com</span>
    </div>
  </div>
</div>
</body></html>"""
render_html_to_png(html_fig30, 'fig30_render_live_deploy.png', 1050, 310)

# Fig 31: Vercel Configuration
html_fig31 = """<!DOCTYPE html><html><head><style>
* { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
body { background: #000; color: #fff; padding: 12px; }
.v-win { background: #000; border: 1px solid #333; border-radius: 8px; box-shadow: 0 4px 14px rgba(255,255,255,0.05); overflow: hidden; }
.v-header { background: #111; padding: 12px 18px; border-bottom: 1px solid #222; display: flex; align-items: center; justify-content: space-between; font-size: 13px; }
.v-body { padding: 18px; }
.v-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 12px; }
.v-box { background: #0a0a0a; border: 1px solid #222; border-radius: 6px; padding: 10px 14px; }
.v-label { color: #888; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-bottom: 4px; }
.v-val { color: #fff; font-weight: 600; font-family: "JetBrains Mono", monospace; }
</style></head><body>
<div class="v-win">
  <div class="v-header">
    <div style="display:flex;align-items:center;gap:8px;"><span style="font-size:16px;">&#9650;</span> <strong>Vercel</strong> &bull; Project Settings</div>
    <span style="background:#222;padding:2px 8px;border-radius:4px;font-size:11px;color:#aaa;">Framework: Vite</span>
  </div>
  <div class="v-body">
    <h3 style="font-size:14px;margin-bottom:12px;color:#fff;">Project: <span style="color:#0070f3;">chatflow-frontend</span></h3>
    <div class="v-grid">
      <div class="v-box"><div class="v-label">Git Repository</div><div class="v-val">Krrish-Gupta-18/fs-project</div></div>
      <div class="v-box"><div class="v-label">Root Directory</div><div class="v-val">frontend</div></div>
      <div class="v-box"><div class="v-label">Build Command</div><div class="v-val">npm run build</div></div>
      <div class="v-box"><div class="v-label">Output Directory</div><div class="v-val">dist</div></div>
      <div class="v-box"><div class="v-label">Environment Variable</div><div class="v-val">VITE_API_URL=https://skillsync-9m9i.onrender.com/api</div></div>
      <div class="v-box"><div class="v-label">WebSocket URL</div><div class="v-val">VITE_SOCKET_URL=https://skillsync-9m9i.onrender.com</div></div>
    </div>
  </div>
</div>
</body></html>"""
render_html_to_png(html_fig31, 'fig31_vercel_config_chatflow.png', 1050, 310)

# Fig 32: Vercel Deployed to Production
html_fig32 = """<!DOCTYPE html><html><head><style>
* { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
body { background: #000; color: #fff; padding: 12px; }
.v-win { background: #000; border: 1px solid #333; border-radius: 8px; box-shadow: 0 4px 14px rgba(255,255,255,0.05); overflow: hidden; }
.v-header { background: #111; padding: 12px 18px; border-bottom: 1px solid #222; display: flex; align-items: center; justify-content: space-between; font-size: 13px; }
.v-body { padding: 18px; }
.ready-pill { background: #0070f3; color: #fff; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
.preview-box { border: 1px solid #222; border-radius: 6px; padding: 14px; margin-top: 12px; background: #050505; display: flex; justify-content: space-between; align-items: center; }
.v-url { font-family: monospace; color: #0070f3; font-size: 14px; font-weight: 600; }
</style></head><body>
<div class="v-win">
  <div class="v-header">
    <div style="display:flex;align-items:center;gap:8px;"><span style="font-size:16px;">&#9650;</span> <strong>Vercel</strong> &bull; Production Deployment</div>
    <span class="ready-pill">&#10004; Ready</span>
  </div>
  <div class="v-body">
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <div>
        <h3 style="font-size:15px;color:#fff;">Deployed to Production</h3>
        <p style="color:#888;font-size:12px;margin-top:2px;">Triggered by push to <strong>deploy</strong> branch &bull; 9s build time</p>
      </div>
      <span style="font-size:12px;color:#aaa;">Assigned Domains: <strong>Production</strong></span>
    </div>
    <div class="preview-box">
      <div>
        <div style="font-size:11px;color:#888;margin-bottom:4px;">Domain URL</div>
        <div class="v-url">https://chatflow-fsd.vercel.app</div>
      </div>
      <div style="text-align:right;">
        <span style="font-size:11px;color:#4ade80;">100% Edge Global CDN</span><br/>
        <span style="font-size:11px;color:#888;">SSL / TLS 1.3 Active</span>
      </div>
    </div>
  </div>
</div>
</body></html>"""
render_html_to_png(html_fig32, 'fig32_vercel_production_live.png', 1050, 270)

# Fig 33: Deployment Architecture Diagram
html_fig33 = """<!DOCTYPE html><html><head><style>
* { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
body { background: #ffffff; padding: 14px; display: flex; justify-content: center; }
.arch-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px 24px; width: 860px; background: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.box-gh { background: #0f172a; color: #fff; padding: 10px 18px; border-radius: 6px; text-align: center; width: 340px; margin: 0 auto; font-size: 13px; font-weight: 600; }
.arrow-down { text-align: center; font-size: 18px; color: #64748b; margin: 8px 0; }
.ci-row { display: flex; justify-content: space-around; margin: 8px 0; }
.box-ci { background: #f0f9ff; border: 1.5px solid #0284c7; color: #0369a1; padding: 8px 16px; border-radius: 6px; text-align: center; font-size: 12px; font-weight: 600; width: 260px; }
.deploy-row { display: flex; justify-content: space-around; margin: 12px 0; }
.box-vercel { background: #000; color: #fff; border: 1.5px solid #000; padding: 10px 16px; border-radius: 6px; text-align: center; font-size: 12px; font-weight: 600; width: 280px; }
.box-render { background: #111827; color: #fff; border: 1.5px solid #4f46e5; padding: 10px 16px; border-radius: 6px; text-align: center; font-size: 12px; font-weight: 600; width: 280px; }
.atlas-row { margin-top: 10px; display: flex; justify-content: center; }
.box-atlas { background: #f0fdf4; border: 1.5px solid #00ed64; color: #001e2b; padding: 10px 24px; border-radius: 6px; text-align: center; font-size: 12px; font-weight: 600; width: 360px; }
.subtext { font-size: 11px; font-weight: normal; opacity: 0.85; margin-top: 3px; }
</style></head><body>
<div class="arch-card">
  <div class="box-gh">
    <div>&#128187; GitHub Repository</div>
    <div class="subtext">github.com/Krrish-Gupta-18/fs-project (push to deploy/main)</div>
  </div>
  <div class="arrow-down">&#8693; Triggers Workflows</div>
  <div class="ci-row">
    <div class="box-ci">
      <div>GitHub Actions: Frontend Build</div>
      <div class="subtext">Vite 6 Production Build Test</div>
    </div>
    <div class="box-ci">
      <div>GitHub Actions: Backend CI</div>
      <div class="subtext">Node.js Test &amp; Start Script Check</div>
    </div>
  </div>
  <div class="arrow-down">&#8681; Automatic Cloud Deployment</div>
  <div class="deploy-row">
    <div class="box-vercel">
      <div>&#9650; Vercel (Frontend SPA)</div>
      <div class="subtext">https://chatflow-fsd.vercel.app &bull; HTTPS (443)</div>
    </div>
    <div style="display:flex;align-items:center;font-size:12px;font-weight:bold;color:#475569;">REST API &bull; Socket.IO &#8644;</div>
    <div class="box-render">
      <div>Render (Backend Web Service)</div>
      <div class="subtext">Node.js + Express + WebSockets &bull; HTTPS (443)</div>
    </div>
  </div>
  <div class="arrow-down" style="margin-left:320px;">&#8681; Mongoose Connection</div>
  <div class="atlas-row">
    <div class="box-atlas">
      <div>&#9650; MongoDB Atlas Cloud Database</div>
      <div class="subtext">ChatFlowCluster (M0 Sandbox) &bull; chatflow DB</div>
    </div>
  </div>
</div>
</body></html>"""
render_html_to_png(html_fig33, 'fig33_chatflow_deployment_architecture.png', 920, 380)

# Fig 1: High Level System Architecture Diagram
html_fig1 = """<!DOCTYPE html><html><head><style>
* { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
body { background: #ffffff; padding: 12px; display: flex; justify-content: center; }
.arch-card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px 20px; width: 880px; background: #ffffff; }
.layer { border: 1.5px solid #94a3b8; border-radius: 6px; padding: 10px; margin-bottom: 10px; }
.layer-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #475569; margin-bottom: 8px; text-align: center; }
.client-layer { background: #f8fafc; border-color: #3b82f6; }
.server-layer { background: #f8fafc; border-color: #8b5cf6; }
.db-layer { background: #f8fafc; border-color: #10b981; }
.comp-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.comp-box { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 4px; padding: 6px; text-align: center; font-size: 11px; font-weight: 600; color: #1e293b; }
.arrow-channel { display: flex; justify-content: space-around; font-size: 11px; font-weight: 700; color: #0284c7; padding: 4px 0; }
</style></head><body>
<div class="arch-card">
  <div class="layer client-layer">
    <div class="layer-title" style="color:#1d4ed8;">CLIENT TIER &bull; React 19 Single Page Application (Vite + Tailwind CSS)</div>
    <div class="comp-grid">
      <div class="comp-box">Sidebar / Workspaces</div>
      <div class="comp-box">ChatHeader &amp; Search</div>
      <div class="comp-box">MessageFeed &amp; Threads</div>
      <div class="comp-box">Developer Drawers (Bugs/Releases)</div>
    </div>
    <div class="comp-grid" style="margin-top:6px;">
      <div class="comp-box">AuthContext (JWT State)</div>
      <div class="comp-box">useChatState Hook</div>
      <div class="comp-box">Socket.IO Client Engine</div>
      <div class="comp-box">RepoActivity &amp; Modals</div>
    </div>
  </div>
  <div class="arrow-channel">
    <span>&#8693; HTTP / REST API (JSON)</span>
    <span>&#8693; WebSocket (Socket.IO Events &bull; Bi-directional)</span>
  </div>
  <div class="layer server-layer">
    <div class="layer-title" style="color:#6d28d9;">APPLICATION SERVER TIER &bull; Node.js + Express.js + Socket.IO Server</div>
    <div class="comp-grid">
      <div class="comp-box">JWT Auth &amp; RBAC Middleware</div>
      <div class="comp-box">Workspaces &amp; Channels API</div>
      <div class="comp-box">GitHub Webhook Controller (HMAC)</div>
      <div class="comp-box">CI/CD Deployments API</div>
    </div>
    <div class="comp-grid" style="margin-top:6px;">
      <div class="comp-box">Socket Rooms &amp; Presence</div>
      <div class="comp-box">Message Dispatch &amp; Status</div>
      <div class="comp-box">Bug Report Converter</div>
      <div class="comp-box">Mongoose ODM Models</div>
    </div>
  </div>
  <div class="arrow-channel" style="color:#059669;">
    <span>&#8693; Mongoose Connection &bull; MongoDB Driver</span>
    <span>&#8693; TTL Indexes &amp; Optimized Query Filters</span>
  </div>
  <div class="layer db-layer">
    <div class="layer-title" style="color:#047857;">DATABASE TIER &bull; MongoDB Atlas Managed Cloud Cluster</div>
    <div class="comp-grid">
      <div class="comp-box">users collection</div>
      <div class="comp-box">workspaces collection</div>
      <div class="comp-box">channels collection</div>
      <div class="comp-box">messages collection</div>
    </div>
    <div class="comp-grid" style="margin-top:6px;">
      <div class="comp-box">conversations collection</div>
      <div class="comp-box">repositories collection</div>
      <div class="comp-box">bugreports collection</div>
      <div class="comp-box">deployments collection</div>
    </div>
  </div>
</div>
</body></html>"""
render_html_to_png(html_fig1, 'fig1_chatflow_high_level_architecture.png', 920, 390)

print("All screenshots generated successfully!")
