import os

def load_dummy_log(shell_scripts:str):
    shell_script_lines = shell_scripts.split("\n")
    for shell_script_line in shell_script_lines:
        pass # run actual cmd
    dir_path = os.path.dirname(os.path.realpath(__file__))
    dummy_log_path = os.path.join(dir_path, "local_logs", "sec1.log")
    dummy_log_str = None
    with open(dummy_log_path, "r") as filehandle:
        dummy_log_str = filehandle.read()
    return dummy_log_str