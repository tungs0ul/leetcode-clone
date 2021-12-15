import os
import subprocess
from threading import Thread
import time
from const import languages, PROCESS_TIME_OUT
from code import get_code
import uuid

directory = '/home/ubuntu/code-platform'
#directory = './'


def write_file(id, language, code, test, func, parameters):
    os.makedirs(f'{directory}/{id}', 0o777)
    os.system(f'cp {directory}/cases/{test} {directory}/{id}/test.json')
    os.chmod(f'{directory}/{id}/test.json', 0o555)
    with open(f'{directory}/{id}/test{languages[language]["extension"]}', "w") as f:
        f.write(get_code(func, parameters, language, code))
    os.chmod(f'{directory}/{id}/test{languages[language]["extension"]}', 0o555)


def write_docker(id, language):
    image = languages[language]["image"]
    compiler = languages[language]["compiler"]
    with open(f"{directory}/{id}/Dockerfile", "w") as f:
        f.write(f"FROM {image}\n\n")
        # f.write("WORKDIR /code-heaven/\n\n")
        f.write(
            f"ADD test{languages[language]['extension']} test.json ./\n\n")
        # f.write("RUN chmod 0555 /code-heaven/\n\n")
        f.write(
            f'CMD [ "{compiler}", "/test{languages[language]["extension"]}" ]')
    os.chmod(f"{directory}/{id}/Dockerfile", 0o777)


def remove_file(id):
    subprocess.Popen(["rm", "-rf", f"{directory}/{id}"])


def run_docker(language, code, test, func, parameters):
    id = uuid.uuid1()
    write_file(id, language, code, test, func, parameters)
    write_docker(id, language)
    path = f'{directory}/{id}/'
    tag = f'test_{id}'
    error = False
    stdout = ''
    stderr = ''
    try:
        subprocess.run(["docker", "build", path, "-t", tag])
        run = subprocess.run(["docker", "run", "--rm", "-m", "64mb", "--user", "nobody", "-c", "64", "-t", tag], stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE, timeout=PROCESS_TIME_OUT)
        error = run.returncode != 0
        stdout = run.stdout.decode("utf-8")
        stderr = run.stderr.decode("utf-8")
        thread = Thread(target=remove_docker, args=(id,))
        thread.start()
    except subprocess.TimeoutExpired:
        stderr = "Error: Timeout expired."
    except Exception as e:
        stderr = str(e)
    finally:
        thread = Thread(target=stop_docker, args=(id,))
        thread.start()
        remove_file(id)
        return stdout.split("\r\n")[:-1], stderr, error or len(stderr) > 0


def remove_docker(id):
    try:
        run = subprocess.run(["docker", "ps", "-a"], stdout=subprocess.PIPE)
        lines = run.stdout.decode("utf-8").split("\n")
        for line in lines:
            if "Exited" in line:
                line = line.split()
                subprocess.run(["docker", "rm", {line[0]}])
        subprocess.run(["docker", "image", "rm", "-f", f"test_{id}"])
    except Exception as e:
        print(e)
        # subprocess.run(["docker", "image", "rm", "-f", f"test_{id}"])


def stop_docker(id):
    try:
        run = subprocess.run(["docker", "ps", "-a"], stdout=subprocess.PIPE)
        lines = run.stdout.decode("utf-8").split("\n")
        for line in lines:
            line = line.split()
            if f'test_{id}' in line:
                subprocess.run(
                    ["docker", "stop", f"{line[0]}", "-t" "1"])
                time.sleep(3)
                subprocess.run(
                    ["docker", "rm", f"{line[0]}"])
                subprocess.run(["docker", "image", "rm", "-f", "test_{id}"])
    except Exception as e:
        print(e)
