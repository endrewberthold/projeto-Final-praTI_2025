import pandas as pd
import matplotlib.pyplot as plt

class DataAnalysis:
    def __init__(self, dataframe):
        self.df = dataframe

    def analyze_difficulty_levels(self):
        print(self.df['NU_PARAM_B'].describe())

        plt.hist(self.df['NU_PARAM_B'], bins=30, edgecolor='black')
        plt.xlabel('NU_PARAM_B')
        plt.ylabel('Frequência')
        plt.title('Distribuição dos níveis de dificuldade')
        plt.show()