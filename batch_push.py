import os
import subprocess

def run_cmd(cmd):
    print("Running:", cmd)
    subprocess.run(cmd)

# 1. First, handle any deleted songs (git add -u)
subprocess.run(["git", "add", "-u", "public/songs/"])
res = subprocess.run(["git", "commit", "-m", "Remove deleted songs"])
if res.returncode == 0:
    subprocess.run(["git", "push", "origin", "main"])

# 2. Now batch the remaining untracked/modified songs
files = [f for f in os.listdir("public/songs") if os.path.isfile(os.path.join("public/songs", f))]
batch_size = 20

for i in range(0, len(files), batch_size):
    batch = files[i:i+batch_size]
    print(f"\nProcessing batch {i//batch_size + 1} (Files {i} to {i+len(batch)})...")
    
    # Add files one by one safely
    for f in batch:
        filepath = os.path.join("public/songs", f)
        subprocess.run(["git", "add", filepath])
    
    # Commit the batch
    commit_res = subprocess.run(["git", "commit", "-m", f"Add songs batch {i//batch_size + 1}"])
    
    # Only push if commit was successful (i.e. there were actually files to commit)
    if commit_res.returncode == 0:
        push_res = subprocess.run(["git", "push", "origin", "main"])
        if push_res.returncode != 0:
            print("Failed to push batch! Stopping.")
            break

print("Done!")
