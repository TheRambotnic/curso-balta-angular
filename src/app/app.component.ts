import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tarefa } from 'src/models/Tarefa';
import { TarefaMode } from 'src/models/TarefaMode';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html', // arquivo HTML que utiliza os componentes
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	public mode: TarefaMode = 0;
	public tarefas: Tarefa[] = [];
	public titulo: string = "Minhas Tarefas de Hoje";
	public formTarefa: FormGroup;

	constructor(private fb: FormBuilder) {}

	ngOnInit(): void {
		this.formTarefa = this.fb.group({
			tarefaDescritivo: [
				"", // valor padrão

				// array de validações
				[
					Validators.minLength(4),
					Validators.maxLength(60),
					Validators.required
				]
			]
		});

		this.carregar();
	}

	// limpa campos do formulário
	limpar(): void {
		this.formTarefa.reset();
	}

	adicionar(): void {
		const descritivo = this.formTarefa.controls["tarefaDescritivo"].value;
		const id = this.tarefas.length + 1;
		this.tarefas.push(new Tarefa(id, descritivo, false));
		this.salvar();
		this.limpar();
	}

	remover(tarefa: Tarefa): void {
		// procura índice da tarefa passada dentro do array da classe
		const index = this.tarefas.indexOf(tarefa);

		if (index !== -1) {
			this.tarefas.splice(index, 1);
		}

		this.salvar();
	}

	mudarEstado(mode: number): void {
		this.mode = mode;
	}

	marcarFeito(tarefa: Tarefa): void {
		tarefa.feito = true;
		this.salvar();
	}

	marcarNaoFeito(tarefa: Tarefa): void {
		tarefa.feito = false;
		this.salvar();
	}

	salvar(): void {
		const dado = JSON.stringify(this.tarefas); // .stringify = converte JSON para string
		localStorage.setItem("tarefa", dado);
	}

	// localStorage
	carregar(): void {
		const dado = localStorage.getItem("tarefa");
		
		// ver se não veio nulo do localStorage
		if (dado) {
			this.tarefas = JSON.parse(dado); // .parse = converte string para JSON
		}
		else {
			this.tarefas = [];
		}
	}
}
